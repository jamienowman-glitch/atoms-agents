import pytest
import re
from atoms_agents.runtime.privacy.models import PiiType
from atoms_agents.runtime.privacy.detectors import PiiDetector
from atoms_agents.runtime.privacy.tokenizer import PiiTokenizer
from atoms_agents.runtime.privacy.scrubber import PiiScrubber, RecursiveScrubber
from atoms_agents.runtime.privacy.policy import FailClosedPolicy

class TestPiiDetector:
    def test_email_detection(self):
        detector = PiiDetector()
        text = "Contact me at test@example.com or user.name+tag@domain.co.uk"
        matches = detector.detect(text)
        assert len(matches) == 2
        assert matches[0].pii_type == PiiType.EMAIL
        assert matches[0].value == "test@example.com"
        assert matches[1].value == "user.name+tag@domain.co.uk"

    def test_phone_detection(self):
        detector = PiiDetector()
        text = "Call 123-456-7890 or (123) 456-7890"
        matches = detector.detect(text)
        # Note: Depending on regex overlap, might need careful assertion
        # The simple regex expects 3-3-4
        assert len(matches) >= 2
        assert all(m.pii_type == PiiType.PHONE for m in matches)
        assert "123-456-7890" in [m.value for m in matches]

    def test_ssn_detection(self):
        detector = PiiDetector()
        text = "My SSN is 123-45-6789. Not 000-00-0000."
        matches = detector.detect(text)
        assert len(matches) == 1
        assert matches[0].pii_type == PiiType.SSN
        assert matches[0].value == "123-45-6789"

class TestPiiScrubber:
    def test_scrub_text_simple(self):
        scrubber = PiiScrubber()
        text = "Email test@example.com now."
        result = scrubber.scrub_text(text)
        assert result.pii_found is True
        # Check format [EMAIL:hash]
        assert re.search(r"\[EMAIL:[a-f0-9]{12}\]", result.cleaned_text)
        assert "test@example.com" not in result.cleaned_text

    def test_scrub_text_multiple(self):
        scrubber = PiiScrubber()
        text = "Email a@b.com and call 555-555-5555"
        result = scrubber.scrub_text(text)
        assert result.pii_found is True
        assert re.search(r"\[EMAIL:[a-f0-9]{12}\]", result.cleaned_text)
        assert re.search(r"\[PHONE:[a-f0-9]{12}\]", result.cleaned_text)

    def test_clean_text_untouched(self):
        scrubber = PiiScrubber()
        text = "Hello world, no PII here."
        result = scrubber.scrub_text(text)
        assert result.pii_found is False
        assert result.cleaned_text == text

class TestRecursiveScrubber:
    def test_scrub_dict(self):
        scrubber = RecursiveScrubber()
        data = {
            "user": {
                "email": "test@example.com",
                "name": "John Doe"
            },
            "safe": "value"
        }
        result = scrubber.scrub(data)
        assert result.pii_found is True
        email_val = result.cleaned_structure["user"]["email"]
        assert "test@example.com" not in email_val
        assert re.search(r"\[EMAIL:[a-f0-9]{12}\]", email_val)
        assert result.cleaned_structure["safe"] == "value"

    def test_scrub_list(self):
        scrubber = RecursiveScrubber()
        data = ["safe", "email@example.com", 123]
        result = scrubber.scrub(data)
        assert result.pii_found is True
        assert re.search(r"\[EMAIL:[a-f0-9]{12}\]", result.cleaned_structure[1])
        assert result.cleaned_structure[0] == "safe"
        assert result.cleaned_structure[2] == 123

class TestFailClosedPolicy:
    def test_policy_allows_pass(self):
        # Current policy assumes scrub happened and is valid
        policy = FailClosedPolicy()
        scrubber = RecursiveScrubber()
        res = scrubber.scrub({"a": "b"})
        assert policy.validate(res) is True
        assert policy.enforce(res) == {"a": "b"}

    def test_policy_rejects_none(self):
        policy = FailClosedPolicy()
        with pytest.raises(ValueError, match="Privacy policy validation failed"):
            policy.enforce(None)

    def test_policy_rejects_missing_structure(self):
        policy = FailClosedPolicy()
        from atoms_agents.runtime.privacy.models import StructureScrubResult
        bad_res = StructureScrubResult(cleaned_structure=None, pii_found=False)
        assert policy.validate(bad_res) is False
        with pytest.raises(ValueError):
            policy.enforce(bad_res)

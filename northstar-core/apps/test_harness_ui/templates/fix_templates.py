
import re

file_path = '/Users/jaynowman/dev/northstar-core/apps/test_harness_ui/templates/builder.html'

with open(file_path, 'r') as f:
    content = f.read()

# Pattern 1: $ { \n variable \n } -> ${variable}
# We look for $ { (with optional space), some whitespace/newlines, content, whitespace/newlines, }
pattern = r'\$\s*\{\s*\n\s*([^\}]+?)\s*\n\s*\}'

def replacer(match):
    # match.group(1) is the inner content (e.g. p.id)
    return f"${{{match.group(1).strip()}}}"

fixed_content = re.sub(pattern, replacer, content)

# Pattern 2: simple $ { without newlines but with space
pattern2 = r'\$\s+\{'
fixed_content = re.sub(pattern2, '${', fixed_content)

# Pattern 3: Unescaped newlines in double quoted strings
# This is harder to regex safely without a parser, but let's try to catch the obvious ones from the logs
# " expected_output: " ... " "
# The logs mentioned: expected_output: "${s.expected_output}" 
# If s.expected_output has newlines, it breaks.
# But the code seen in view was:
# y += ` expected_output: "${s.expected_output}" \n`;
# This is inside a backtick string, so it SHOULD be fine?
# Unless the generated code ITSELF has a newline?
# No, `s.expected_output` is a JS variable.
# The issue might be the ` \n` at the end?
# Let's start with fixing the ${} and see.

with open(file_path, 'w') as f:
    f.write(fixed_content)

print("Fixed template literals.")

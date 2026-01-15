
import os

file_path = '/Users/jaynowman/dev/northstar-core/apps/test_harness_ui/templates/builder.html'

with open(file_path, 'r') as f:
    lines = f.readlines()

# Line 530 is index 529.
# Line 1038 is index 1037.
# We want to remove lines 530 through 1038 (inclusive).
# So we keep lines[:529] and lines[1038:] (index 1038 is line 1039).

# Verify content to be sure
line_530_content = lines[529].strip()
line_1038_content = lines[1037].strip()

print(f"Line 530 check: {line_530_content}")
print(f"Line 1038 check: {line_1038_content}")

if "async function loadAgents" not in line_530_content:
    print("WARNING: Line 530 does not match expectation!")

if "<script>" not in line_1038_content:
    print("WARNING: Line 1038 does not match expectation!")

new_lines = lines[:529] + lines[1038:]

with open(file_path, 'w') as f:
    f.writelines(new_lines)

print("Successfully deduped builder.html.")

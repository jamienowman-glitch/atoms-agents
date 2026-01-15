import sys
import csv
from fontTools.ttLib import TTFont

if len(sys.argv) < 2:
    print("Usage: python dump_roboto_flex_instances.py <path-to-roboto-flex.ttf>", file=sys.stderr)
    sys.exit(1)

font_path = sys.argv[1]
font = TTFont(font_path)

# fvar holds variable axes + named instances
fvar = font["fvar"]

# All axis tags present in this font (wght, wdth, slnt, opsz, GRAD, etc.)
axis_tags = [axis.axisTag for axis in fvar.axes]

writer = csv.writer(sys.stdout, delimiter="\t")

# Header row: preset name + all axis tags
writer.writerow(["name"] + axis_tags)

name_table = font["name"]

for inst in fvar.instances:
    name = name_table.getDebugName(inst.subfamilyNameID) or "unnamed"
    row = [name]
    for tag in axis_tags:
        value = inst.coordinates.get(tag, "")
        row.append(value)
    writer.writerow(row)
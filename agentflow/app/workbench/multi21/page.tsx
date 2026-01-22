import { Multi21Designer } from "@/app/nx-marketing-agents/core/multi21/Multi21Designer";
import { WorkbenchShell } from "@/components/workbench/WorkbenchShell";
import { Multi21Cartridge } from "@/components/workbench/cartridges/multi21";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MULTI 2¹ Designer",
    description: "Pre-factory UI for designing Multi 2¹ grids",
};

export default function Multi21Page() {
    return (
        <WorkbenchShell cartridge={Multi21Cartridge}>
            <Multi21Designer />
        </WorkbenchShell>
    );
}

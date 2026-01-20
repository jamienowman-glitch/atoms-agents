import { Multi21Designer } from "@/app/nx-marketing-agents/core/multi21/Multi21Designer";
import { BuilderShell } from "@/app/nx-marketing-agents/core/multi21/BuilderShell";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MULTI 2¹ Designer",
    description: "Pre-factory UI for designing Multi 2¹ grids",
};

export default function Multi21Page() {
    return (
        <BuilderShell>
            <Multi21Designer />
        </BuilderShell>
    );
}

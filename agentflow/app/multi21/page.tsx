import { Multi21Designer } from "../../components/multi21/Multi21Designer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MULTI 2¹ Designer",
    description: "Pre-factory UI for designing Multi 2¹ grids",
};

export default function Multi21Page() {
    return <Multi21Designer />;
}

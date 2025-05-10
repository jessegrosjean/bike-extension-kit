import { DOMExtensionContext } from "@dom";
import * as d3 from "d3";

interface NodeData {
    name: string;
    children?: NodeData[];
}

export function activate(context: DOMExtensionContext) {
    context.onmessage = (message: { type: string, data: NodeData }) => {
        if (message.type == "load" && message.data) {
            context.element.appendChild(generateTreeSVG(message.data));
        }
    }
}

function generateTreeSVG(data: NodeData): any {
    const hierarchyRoot = d3.hierarchy(data);
    const width = window.innerWidth
    const height = window.innerHeight
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) / 2;
    
    const layoutRoot = d3
        .tree<NodeData>()
        .size([2 * Math.PI, radius])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)
        (hierarchyRoot);
    
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-cx, -cy, width, height])
        .attr("style", "width: 100%; height: auto");
    
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(layoutRoot.links())
        .join("path")
        .attr("d", (d) => {
            const linkGenerator = d3
                .linkRadial<d3.HierarchyPointLink<NodeData>, d3.HierarchyPointNode<NodeData>>()
                .angle(d => d.x)
                .radius(d => d.y);
            return linkGenerator(d as d3.HierarchyPointLink<NodeData>);
        });
    
    const node = svg.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll()
        .data(layoutRoot.descendants())
        .join("g")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);
    
    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);
    
    node.append("text")
        .attr("transform", d => `rotate(${d.x >= Math.PI ? 180 : 0})`)
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke", "white");
    
    return svg.node();
}
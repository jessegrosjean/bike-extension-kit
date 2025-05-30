import { DOMExtensionContext } from 'bike/dom'
import * as d3 from 'd3'

interface NodeData {
  id: string
  name: string
  children?: NodeData[]
}

export async function activate(context: DOMExtensionContext) {
  context.onmessage = (message: { type: string; data: NodeData }) => {
    if (message.type == 'load' && message.data) {
      context.element.appendChild(generateTreeSVG(message.data, context))
    }
  }
}

function generateTreeSVG(data: NodeData, context: DOMExtensionContext): any {
  const hierarchyRoot = d3.hierarchy(data)
  const width = window.innerWidth
  const dx = 14
  const dy = width / (hierarchyRoot.height + 1)
  const layoutRoot = d3.tree<NodeData>().nodeSize([dx, dy])(hierarchyRoot)

  let x0 = Infinity
  let x1 = -x0
  layoutRoot.each((d: d3.HierarchyPointNode<NodeData>) => {
    if (d.x > x1) x1 = d.x
    if (d.x < x0) x0 = d.x
  })

  const height = x1 - x0 + dx * 2

  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-dy / 3, x0 - dx, width, height])
    .attr('style', 'max-width: 100%; height: auto;')

  const link = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .selectAll()
    .data(hierarchyRoot.links())
    .join('path')
    .attr('d', (d) => {
      const linkGenerator = d3
        .linkHorizontal<d3.HierarchyPointLink<NodeData>, d3.HierarchyPointNode<NodeData>>()
        .x((d) => d.y)
        .y((d) => d.x)
      return linkGenerator(d as d3.HierarchyPointLink<NodeData>)
    })

  const node = svg
    .append('g')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .selectAll()
    .data(layoutRoot.descendants())
    .join('g')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)

  node
    .append('circle')
    .attr('fill', (d) => (d.children ? '#555' : '#999'))
    .attr('r', 2.5)

  node
    .append('text')
    .style('cursor', 'default')
    .on('mouseover', function (event) {
      d3.select(this).style('text-decoration', 'underline')
    })
    .on('mouseout', function (event) {
      d3.select(this).style('text-decoration', 'none')
    })
    .on('click', function (event, d) {
      context.postMessage({
        type: 'select',
        id: d.data.id,
      })
    })
    .attr('dy', '0.31em')
    .attr('x', (d) => (d.children ? -6 : 6))
    .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr('stroke', 'white')

  return svg.node()
}

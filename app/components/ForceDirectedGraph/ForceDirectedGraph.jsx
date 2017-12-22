import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';
import blankGif from '../../stylesheets/blank.gif';

import style from './style.scss';

export default class ForceDirectedGraph extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    chartData: PropTypes.array,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.margin = { top: 50, bottom: 100, right: 75, left: 75 };
    const { chartData } = props;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.nodes.length > 0) {
      this.d3Render(nextProps);
    }
  }



  d3Render = (props) => {
    const self = this;
    const node = this.node;
    const width = props.width - this.margin.right - this.margin.left;
    const height = props.height - this.margin.top - this.margin.bottom;
    const { data } = props;
    const { nodes, links } = data;

    console.log('Graph', data);

    // simulation setup with all forces
    const simulation = d3
      .forceSimulation()
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody().strength(-15).distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(7).strength(0.2));

    /* Append Chart Grouping */
    const svgCanvas = d3.select(node)
      .attr('width', width)
      .attr('height', height);

    /* Tooltip Creation */
    const popup = d3.select(`.${style.svgWrapper}`)
      .append('div').classed(style.tooltip, true)
      .style('opacity', 0);


    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
      d3.select(d).raise
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    // const nodeElements = svgCanvas.append('g')
    //   .attr('class', style.nodes)
    //   .selectAll('circle')
    //   .data(nodes)
    //   .enter()
    //   .append('circle')
    //     .attr('r', 5)
    //     .attr('fill', (d, i) => i % 2 === 0 ? 'red' : 'green')
    //   .call(d3.drag()
    //     .on('start', dragstarted)
    //     .on('drag', dragged)
    //     .on('end', dragended));
    const nodeElements = d3.select(`.${style.svgWrapper}`).append("div")
      .attr('class', style.nodes)
      .selectAll(`.flag`)
      .data(nodes)
      .enter()
      .append("img")
        .attr('src', blankGif)
        .attr('class', (d) => (
          `flag flag-${d.code} ${style.flag}`
        ))
      .on('mouseover', function mouseOver(d) {
        d3.select(this)
          .raise();  // styling handle in stylesheet
        popup
          .raise()
          .transition()
          .duration(50)
          .style('opacity', 0.9);
        popup
          .style('left', `${d3.event.pageX - 35 }px`)
          .style('top', `${d3.event.pageY - 90}px`)
          .html(`<p class=${style.tooltipText}>${d.country}</p>`);
      })
      .on('mouseout', (d) => (
        popup
          .transition()
          .duration(800)
          .style('opacity', 0)
      ))
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    const linkElements = svgCanvas
      .append('g').attr('class', style.links)
      .selectAll(`line`)
      .data(links)
      .enter()
      .append('line').attr('class', style.link)
        .attr('stroke-width', 2);

    const ticked = () => {

      // nodeElements
      //   .attr("cx", function(d) { return d.x; })
      //   .attr("cy", function(d) { return d.y; });
      nodeElements
        .style('top', function (node) { return `${node.y}px` })
        .style('left', function (node) { return `${node.x}px` })
        // .style('transform', (node) => `translate(${node.x}, ${node.y})`)
      linkElements
        .attr('x1', function (link) { return link.source.x })
        .attr('x2', function (link) { return link.target.x })
        .attr('y1', function (link) { return link.source.y })
        .attr('y2', function (link) { return link.target.y })
    };
    simulation
      .nodes(nodes)
      .on('tick', ticked);
    simulation.force('link').links(links)



    //  Populate Chart with Data
    // svgCanvas.append('g').classed('forceGraph', true)







    svgCanvas.exit().remove();



  }

  render() {
    return (
      <div className={style.svgWrapper}>
        <svg
          className={style.svg}
          width={this.props.width} height={this.props.height}
          ref={(node) => this.node = node}
        >
        </svg>
      </div>
    );
  }
}

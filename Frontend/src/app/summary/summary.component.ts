import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import axios from 'axios';
import * as d3 from 'd3';

@Component({
  selector: 'pb-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  data: any[] = [];  // The data fetched from API
  @ViewChild('pieChart', { static: true }) private chartContainer: ElementRef | undefined;
  
  constructor() { }

  ngOnInit(): void {
    this.fetchAiModelEfficiencyData();
  }

  fetchAiModelEfficiencyData(): void {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://143.198.111.165:3000/api/aiModelEfficency', {
      headers: {
        'Authorization': `Bearer ${token}`  
      }
    }).then((response) => {
      this.data = response.data;
      console.log(this.data);
      this.createScatterPlot();  // Call to create the pie chart after data is fetched
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        alert('Session Expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/'; 
      }
      console.error('Error fetching Ai Model Efficiency data:', error);
    });
  }

 
  createScatterPlot(): void {
    const margin = 150;
    const width = 900 - margin * 2;
    const height = 500 - margin * 2;
  
    const svg = d3.select(this.chartContainer?.nativeElement)  
      .append('svg')
      .attr('width', width + margin * 2)
      .attr('height', height + margin * 2)
      .append('g')
      .attr('transform', `translate(${margin}, ${margin})`);
    
    // Define scales for x and y axes
    const x = d3.scaleLinear()
      .domain([40, d3.max(this.data, d => d.efficiency_score) || 0])  // Map efficiency score to x-axis
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.computational_cost) || 0])  // Map computational cost to y-axis
      .range([height, 0]);
  
    // Add X and Y axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    svg.append('g')
      .call(d3.axisLeft(y));
  
    // Create circles for the scatter plot
    svg.selectAll('circle')
      .data(this.data)
      .enter().append('circle')
      .attr('cx', d => x(d.efficiency_score))  // X position based on efficiency score
      .attr('cy', d => y(d.computational_cost))  // Y position based on computational cost
      .attr('r', 5)  // Circle radius
      .attr('fill', 'steelblue');
    
      svg.append('text')
      .attr('x', width / 2)  // Position at the center of the x-axis
      .attr('y', height + 5 + margin / 2)  // Place below the x-axis
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Efficiency Score');  // Label for the x-axis
  
    svg.append('text')
      .attr('x', -height / 2)  // Position the label at the center of the y-axis
      .attr('y', -margin / 1.5)  // Place to the left of the y-axis
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Computational Cost')  // Label for the y-axis
      .attr('transform', 'rotate(-90)');
    
      svg.selectAll('text.labels')
      .data(this.data)
      .enter().append('text')
      .attr('x', d => x(d.efficiency_score) + 10)  // Offset to the right of the circle
      .attr('y', d => y(d.computational_cost) - 10)  // Slightly above the circle
      .style('font-size', '12px')  // Font size for readability
      .style('fill', 'black')  // Text color
      .style('z-index', '10')  // Ensure text is on top
      .attr('class', 'labels')
      .text(d => `${d.model}`);
  
      
    }
  
}

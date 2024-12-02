import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  data: any[] = [];  // The data fetched from API
  private svg: any;
  private margin = 60;
  private width = 800;
  private height = 400;

  constructor() { }

  ngOnInit(): void {
    this.fetchAiImplementationData();
  }

  fetchAiImplementationData(): void {
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://143.198.111.165:3000/api/aiImplementationCost', {
      headers: {
        'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
      }
    }).then((response) => {
        this.data = response.data;
        console.log(this.data);
        this.createSvg();
        this.drawBarChart(this.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show an alert if the status is 401
          alert('Session Expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/'; 
        }
        console.error('Error fetching Ai Implementation Cost data:', error);
      });
  }

  private createSvg(): void {
    this.svg = d3.select('div#bar')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`);
  }

  private drawBarChart(data: any[]): void {
    // Set up the scales
    const x0 = d3.scaleBand()
      .domain(data.map(d => d.industry))
      .range([0, this.width - 2 * this.margin])
      .padding(0.1);

    const x1 = d3.scaleBand()
      .domain(['2023', '2024'])
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.cost_2023, d.cost_2024)) || 0])
      .nice()
      .range([this.height - 2 * this.margin, 0]);

    // Add X and Y axes
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height - 2 * this.margin})`)
      .call(d3.axisBottom(x0));

    this.svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d3.format(".0s")));

    // Draw bars for 2023 and 2024
    this.svg.selectAll('.bar')
      .data(data)
      .enter().append('g')
      .attr('transform', (d:any) => `translate(${x0(d.industry)}, 0)`)
      .selectAll('rect')
      .data((d:any ) => [
        { year: '2023', value: d.cost_2023 },
        { year: '2024', value: d.cost_2024 }
      ])
      .enter().append('rect')
      .attr('x', (d:any) => x1(d.year))
      .attr('y', (d:any) => y(d.value))
      .attr('width', x1.bandwidth())
      .attr('height', (d:any) => this.height - 2 * this.margin - y(d.value))
      .attr('fill', (d:any, i:number) => i === 0 ? 'steelblue' : 'orange');

      this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin + 20)
      .attr('x', 0 - this.height / 2 - this.margin + 50)
      .style('text-anchor', 'middle')
      .text('Expenditure ($)');
    
  }
}

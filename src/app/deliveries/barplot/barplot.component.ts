import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, 
  LinearScale, Title, BarElement, BarController} from 'chart.js'
import {CategoryScale} from 'chart.js';
import { Delivery } from '../delivery.model';

@Component({
  selector: 'app-barplot',
  templateUrl: './barplot.component.html',
  styleUrls: ['./barplot.component.scss'],
})
export class BarplotComponent implements OnInit {

  @Input() deliveries : Delivery[];
  @ViewChild("barChart", {static: true}) private barChart: ElementRef;
  graphic: any;
  colorArray: any;
  isBar : boolean = true;
  start = 0;
  nbItems = 10;
  backOK : boolean;
  forwardOK : boolean;

  constructor() { }

  ngOnInit() {
    this.createBarChart();
    this.backOK = false;
    this.forwardOK = this.deliveries.length > 10 ? true : false;
  }

  createBarChart() {
    Chart.register(LineController, BarController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title);
    this.graphic = new Chart(this.barChart.nativeElement, {
      type: this.isBar? "bar" : "line",
      data: {
        labels: this.getLabels(),
        datasets: [{
          label: 'Doses reçues',
          data: this.getReceivedDoseTotal(),
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }, {
          label: 'Doses ucd reçues',
          data: this.getReceivedUcdTotal(),
          backgroundColor: '#dd1144',
          borderColor: '#dd1144',
          borderWidth: 1
        },]
      },
      options: {
        scales: {}
      }
    });
  }
  
  getLabels() : string[]{
    let region_names = this.deliveries.map(d => d.fields.reg_name.slice(0, 6)).slice(this.start, this.start+this.nbItems);
    let vaccins = this.deliveries.map(d => d.fields.vaccine_type.slice(0, 3)).slice(this.start, this.start+this.nbItems);
    return this.deliveries.slice(this.start, this.start+this.nbItems).map((d, index) => { 
      const region = region_names[index] ? region_names[index] : "UR";
      const vaccin = vaccins[index] ? vaccins[index] : "UV";
      return region.concat("-").concat(vaccin)
    });
  }
  
  getReceivedDoseTotal() : number[]{
    return this.deliveries.map(d => d.fields.received_dose_total).slice(this.start, this.start+this.nbItems);
  }
  
  getReceivedUcdTotal() : number[]{
    return this.deliveries.map(d => d.fields.received_ucd_total).slice(this.start, this.start+this.nbItems);
  }

  public toggleDisplay() {
    this.isBar = !this.isBar;
    this.graphic.destroy()
    this.createBarChart();
  }

  goBack(){
    if(this.backOK){
      this.start = (this.start - 10 > 0) ? this.start - 10 : 0;
      this.backOK = this.start == 0 ? false : true;
      this.nbItems = (this.start + 10 < this.deliveries.length-1) ? 10 : this.deliveries.length-1-this.start;
      this.forwardOK = this.nbItems == 10 ? true : false;
      this.graphic.destroy()
      this.createBarChart();
    }
  }

  goForward(){
    if(this.forwardOK){
      this.start = (this.start + 10 < this.deliveries.length) ? this.start + 10 : this.start;
      this.nbItems = (this.start + 10 < this.deliveries.length-1) ? 10 : this.deliveries.length-this.start;
      this.forwardOK = this.nbItems == 10 ? true : false;
      this.backOK = this.start == 0 ? false : true;
      this.graphic.destroy()
      this.createBarChart();
    }
  }
}

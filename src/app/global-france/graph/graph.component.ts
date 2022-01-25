import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart, ChartConfiguration, LineController, LineElement, PointElement, 
         LinearScale, Title, BarElement, BarController} from 'chart.js'
import {CategoryScale} from 'chart.js';
import { Record } from '../record.model';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {

  @Input() records : Record[];
  @ViewChild("graph", {static: true}) private graph: ElementRef;
  graphic: any;
  colorArray: any;
  isBar : boolean = true;
  start = 0;
  nbItems = 10;
  backOK : boolean;
  forwardOK : boolean;
  form: FormGroup;
  selectedData = "tot_recovered";

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      selectedData : new FormControl("tot_recovered", {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
    this.createBarChart();
    this.backOK = false;
    this.forwardOK = this.records.length > 10 ? true : false;
  }

  createBarChart() {
    Chart.register(LineController, BarController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Title);
    this.graphic = new Chart(this.graph.nativeElement, {
      type: this.isBar? "bar" : "line",
      data: {
        labels: this.getDates(),
        datasets: [{
          label: 'Doses reçues',
          data: this.getData(),
          backgroundColor: 'rgb(38, 194, 129)',
          borderColor: 'rgb(38, 194, 129)',
          borderWidth: 1
        }, ]
      },
      options: {
        scales: {}
      }
    });
  }
  
  getDates() : string[]{
    return this.records.map(d => d.fields.date.slice(0, 10)).slice(this.start, this.start+this.nbItems);
  }

  getData(){
    if(this.selectedData == "tot_recovered") {return this.getTotalRecovered();}
    if(this.selectedData == "tot_positive") {return this.getTotalPositive();}
    if(this.selectedData == "tot_death_hosp") {return this.getDecesHopital();}
    if(this.selectedData == "tot_icu") {return this.getReanimation();}
    if(this.selectedData == "count_new_hosp") {return this.getNexPatientsHospitalized();}
  }
  
  getTotalRecovered() : number[]{
    return this.records.map(d => d.fields.tot_recovered).slice(this.start, this.start+this.nbItems);
  }
  
  getTotalPositive() : number[]{
    return this.records.map(d => d.fields.tot_positive).slice(this.start, this.start+this.nbItems);
  }
  
  getDecesHopital() : number[]{
    return this.records.map(d => d.fields.tot_death_hosp).slice(this.start, this.start+this.nbItems);
  }
  
  getReanimation() : number[]{
    return this.records.map(d => d.fields.tot_icu).slice(this.start, this.start+this.nbItems);
  }
  
  getNexPatientsHospitalized() : number[]{
    return this.records.map(d => d.fields.count_new_hosp).slice(this.start, this.start+this.nbItems);
  }

  goBack(){
    if(this.backOK){
      this.start = (this.start - 10 > 0) ? this.start - 10 : 0;
      this.backOK = this.start == 0 ? false : true;
      this.nbItems = (this.start + 10 < this.records.length-1) ? 10 : this.records.length-1-this.start;
      this.forwardOK = this.nbItems == 10 ? true : false;
      this.graphic.destroy()
      this.createBarChart();
    }
  }

  goForward(){
    if(this.forwardOK){
      this.start = (this.start + 10 < this.records.length) ? this.start + 10 : this.start;
      this.nbItems = (this.start + 10 < this.records.length-1) ? 10 : this.records.length-this.start;
      this.forwardOK = this.nbItems == 10 ? true : false;
      this.backOK = this.start == 0 ? false : true;
      this.graphic.destroy()
      this.createBarChart();
    }
  }

  onChange(event){
    this.graphic.destroy();
    this.selectedData = event.detail.value;
    this.createBarChart();
  }

  translate(){
    if(this.selectedData == "tot_recovered") return "Retours à domicile";
    if(this.selectedData == "tot_positive") return "Cas confirmés";
    if(this.selectedData == "tot_death_hosp") return "Décès à l'hôpital";
    if(this.selectedData == "tot_icu") return "Réanimations";
    if(this.selectedData == "count_new_hosp") return "Nouveaux patients hospitalisés";
  }
}

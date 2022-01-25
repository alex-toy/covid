import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  @ViewChild('message', { static: false }) message: ElementRef;

  constructor(
    private animationCtrl: AnimationController,
    private router: Router,
    private localStorageService : LocalStorageService,
  ) { }

  simpleAnimation() {
    let t = 930;
    setTimeout(() => {
      this.message.nativeElement.innerHTML = "Bienvenue ...";
    }, 0); 
    setTimeout(() => {
      this.message.nativeElement.innerHTML = "chez covidDTEKtor...";
    }, t); 
    setTimeout(() => {
      this.message.nativeElement.innerHTML = "L'application qui vous permet...";
    }, 2*t);
    setTimeout(() => {
      this.message.nativeElement.innerHTML = "D'avoir toutes les infos COVID...";
    }, 3*t);
    setTimeout(() => {
      this.message.nativeElement.innerHTML = "en temps réel. Par Alessio Rea !!!!!";
    }, 4*t);
    setTimeout(() => {
      let startFlow = this.localStorageService.getItem("startFlow") ?? "places";
      let url = `/${startFlow}`;
      this.router.navigateByUrl(url);
    }, 5*t);
  }

  strongAnimation(){
    const animation : Animation = this.animationCtrl.create()
    .addElement(document.querySelector('.square'))
    .duration(5000)
    .iterations(Infinity)
    .fromTo('transform', 'translateY(0px)', 'translateY(300px)')
    .fromTo('opacity', '1', '0.5');
    animation.play();
  }

  otherAnimation(){
    const animation : Animation = this.animationCtrl.create()
    .addElement(document.querySelector('.square'))
    .duration(5200)
    .iterations(Infinity)
    .keyframes([
      { offset: 0, background: 'red' },
      { offset: 0.72, background: 'var(--background)' },
      { offset: 1, background: 'green' }
    ])
    .fromTo('transform', 'translateY(0px)', 'translateY(200px)');
    animation.play();
  }

  ngOnInit() {
    this.otherAnimation();
    this.simpleAnimation();
    // this.router.navigateByUrl('/places');
  }
}

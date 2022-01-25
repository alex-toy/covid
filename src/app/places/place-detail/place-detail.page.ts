import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  form: FormGroup;
  place: Place;
  isLoading = false;
  private sub : Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlaceService,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places');
        return;
      }
      this.isLoading = true;
      const placeId =  paramMap.get('placeId');
      this.fetchOne(placeId);
    });
  }

  fetchOne(id : string){
    let fetchedUserId: string;
    this.authService.userId
      .pipe(
        take(1),
        switchMap(userId => {
          if (!userId) {
            throw new Error('Found no user!');
          }
          fetchedUserId = userId;
          return this.placesService.getById(id);
        })
      )
      .subscribe(
        places => this.handleOKResponse(places),
        error => this.handleErrorresponse()
      );
  }

  handleOKResponse(places){
      this.place = places.length > 0 ? places[0] : <Place>{}
      this.isLoading = false;
  }

  handleErrorresponse(){
    this.alertCtrl
      .create({
        header: "Une erreur s'est produite!",
        message: "Le chargement n'a pas pu se produire.",
        buttons: [
          {
            text: 'Okay',
            handler: () => { this.router.navigate(['/places']); }
          }
        ]
      })
      .then(alertEl => alertEl.present());
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onLocationPicked(event) {
    console.log(event)
  }
}

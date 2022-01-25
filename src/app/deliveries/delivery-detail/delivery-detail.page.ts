import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Delivery } from '../delivery.model';
import { DeliveryService } from '../delivery.service';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.page.html',
  styleUrls: ['./delivery-detail.page.scss'],
})
export class DeliveryDetailPage implements OnInit {

  isLoading = false;
  private sub : Subscription;
  deliveries : Delivery[];
  delivery: Delivery;

  constructor(
    private deliveryService: DeliveryService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('deliveryId')) {
        this.navCtrl.navigateBack('/deliveries');
        return;
      }
      this.isLoading = true;
      const deliveryId =  paramMap.get('deliveryId');
      this.fetchOne(deliveryId);
    });
  }

  fetchOne(deliveryId : string){
    let fetchedUserId: string;
    this.authService.userId
      .pipe(
        take(1),
        switchMap(userId => {
          if (!userId) {
            throw new Error('Found no user!');
          }
          fetchedUserId = userId;
          return this.deliveryService.getById(deliveryId);
        })
      )
      .subscribe(
        deliveries => this.handleOKResponse(deliveries),
        error => this.handleErrorresponse()
      );
  }

  handleOKResponse(deliveries){
      this.delivery = deliveries.length > 0 ? deliveries[0] : <Delivery>{}
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
            handler: () => { this.router.navigate(['/deliveries']); }
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
}

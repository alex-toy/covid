import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Record } from '../record.model';
import { RecordService } from '../record.service';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.page.html',
  styleUrls: ['./record-detail.page.scss'],
})
export class RecordDetailPage implements OnInit {

  isLoading = false;
  private sub : Subscription;
  records : Record[];
  record: Record;

  constructor(
    private service: RecordService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('recordId')) {
        this.navCtrl.navigateBack('/records');
        return;
      }
      this.isLoading = true;
      const recordId =  paramMap.get('recordId');
      this.fetchOne(recordId);
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
          return this.service.getById(id);
        })
      )
      .subscribe(
        records => this.handleOKResponse(records),
        error => this.handleErrorresponse()
      );
  }

  handleOKResponse(records){
      this.record = records.length > 0 ? records[0] : <Record>{}
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
            handler: () => { this.router.navigate(['/records']); }
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

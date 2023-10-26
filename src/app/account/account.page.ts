import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.models';

import { Observable } from 'rxjs';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
//PLUGIN LECTOR CODIGOS QR
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  //CODIGO QR
  qrCodeString = 'this is a seecret qr code message';
  scannedResult: any;
  content_visibility = '';

  alumnos: any;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private firestore: AngularFirestore,
    private afauth: AngularFireAuth,
  ) {
    //codigo qr
    this.content_visibility = 'show';
  }

  ngOnInit() {
    this.getAlumnos();
  }
  //FUNCIONES LEER CODIGOS QR
  async CheckPermission() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }
  async startScan() {
    try {
      const permission = await this.CheckPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = '';
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if (result?.hasContent) {
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
    } catch (e) {
      console.log(e);
      this.stopScan();
    }
  }
  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }
  ngOnDestroy(): void {
    this.stopScan();
  }
  //FUNCION LOGOUT
  logout(){
    this.afauth.signOut();
    console.log('Cerrando sesión...')
    const log_status = false;
    this.navCtrl.navigateRoot("/home")
  }

  //FUNCIONES COLLECION ALUMNOS
  async getAlumnos() {
    let loader = this.loadingCtrl.create({
      message: "Espere un momento..."
    });
    (await loader).present();

    try {
      this
        .firestore
        .collection("Alumnos")
        .snapshotChanges()
        .subscribe(data => {
          this.alumnos = data.map(e => {
            return {
              id: e.payload.doc.id,
              nombre: e.payload.doc.data()["nombre"],
              rut: e.payload.doc.data()["rut"],
              email: e.payload.doc.data()["email"]
            };
          });
        });
      //DISMISS LOADER
      (await loader).dismiss();

    } catch (e) {
      this.showToast(e);
    }
  }
  showToast(message: string) {
    this.toastCtrl.
      create({
        message: message,
        duration: 3000
      }).then(toastData => toastData.present())
  }

}

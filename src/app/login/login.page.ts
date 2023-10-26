import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { User } from '../models/user.models';
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {} as User;
  constructor(private toastCtrl: ToastController
    , private loadingCtrl: LoadingController
    , private afAuth: AngularFireAuth
    , private navCtrl: NavController) { }

  ngOnInit() {
  }
  async login(user: User) {
    if (this.formValidation()) {
      //Mostramos Loader
      let loader = this.loadingCtrl.create({
        message: "Espere un momento..."
      });
      (await loader).present();
      try {
        await this.afAuth.signInWithEmailAndPassword(user.email, user.password)
          .then(data =>
            console.log(data));
        const log_status = true;
        this.navCtrl.navigateRoot("/account");
      } catch (e) {
        this.showToast(e);
      }
      //Despachamos el loader
      (await loader).dismiss();
      //Redireccionamos al panel de control
    }
  }
  formValidation() {
    if (!this.user.email) {
      this.showToast("Ingresa un correo!");
      return false;
    }
    if (!this.user.password) {
      this.showToast("Ingrese su contraseña!");
      return false;
    }
    return true;
  }

  showToast(message: string) {
    this.toastCtrl.
      create({
        message: message,
        duration: 3000
      }).then(toastData => toastData.present())
  }
}

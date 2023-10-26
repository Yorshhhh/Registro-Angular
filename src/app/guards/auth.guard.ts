import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth
             ,private navCtrl: NavController){

  }
  
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree>{
      const user = await this.afAuth.currentUser;
      const isAuthenticated = user? true:false;
      if(!isAuthenticated){
        alert('Debes estar conectado para acceder a esta pagina');
        this.navCtrl.navigateRoot("/login");
      }
      return isAuthenticated;
  }
  
}

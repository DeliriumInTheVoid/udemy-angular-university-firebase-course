import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { loggedIn } from "@angular/fire/auth-guard";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { UserRoles } from "../model/user-roles";

@Injectable({
    providedIn: "root"
})
export class UserService {
    isLoggedIn$: Observable<boolean>;

    isLoggedOut$: Observable<boolean>;

    pictureUrl$: Observable<string>;

    roles$: Observable<UserRoles>;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
    ) {

        //can be parsed on https://jwt.io/
        //afAuth.idToken.subscribe(jwt => console.log("jwt: ", jwt));
        //afAuth.authState.subscribe(auth => console.log("auth: ", auth));

        this.isLoggedIn$ = this.afAuth.authState.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

        this.pictureUrl$ = this.afAuth.authState.pipe(map(user => user ? user.photoURL : null));

        this.roles$ = this.afAuth.idTokenResult
            .pipe(
                map(token => <any>token?.claims ?? {admin: false})
            );
    }

    logOut() {
        this.afAuth.signOut();
        this.router.navigateByUrl("/login");
    }

}
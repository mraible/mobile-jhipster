import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Preferences } from './preferences.model';
import { PreferencesService } from './preferences.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'page-preferences-update',
    templateUrl: 'preferences-update.html'
})
export class PreferencesUpdatePage implements OnInit {

    preferences: Preferences;
    users: User[];
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        weeklyGoal: [null, [Validators.required]],
        weightUnits: [null, [Validators.required]],
        user: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private userService: UserService,
        private preferencesService: PreferencesService
    ) {

        // Watch the form for changes, and
        this.form.valueChanges.subscribe((v) => {
            this.isReadyToSave = this.form.valid;
        });

    }

    ngOnInit() {
        this.userService.findAll().subscribe(data => this.users = data, (error) => this.onError(error));
        this.activatedRoute.data.subscribe((response) => {
            this.updateForm(response.data);
            this.preferences = response.data;
            this.isNew = this.preferences.id === null || this.preferences.id === undefined;
        });
    }

    updateForm(preferences: Preferences) {
        this.form.patchValue({
            id: preferences.id,
            weeklyGoal: preferences.weeklyGoal,
            weightUnits: preferences.weightUnits,
            user: preferences.user,
        });
    }

    save() {
        this.isSaving = true;
        const preferences = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.preferencesService.update(preferences));
        } else {
            this.subscribeToSaveResponse(this.preferencesService.create(preferences));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Preferences>>) {
        result.subscribe((res: HttpResponse<Preferences>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Preferences ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/preferences');
    }

    previousState() {
        window.history.back();
    }

    async onError(error) {
        this.isSaving = false;
        console.error(error);
        const toast = await this.toastCtrl.create({message: 'Failed to load data', duration: 2000, position: 'middle'});
        toast.present();
    }

    private createFromForm(): Preferences {
        return {
            ...new Preferences(),
            id: this.form.get(['id']).value,
            weeklyGoal: this.form.get(['weeklyGoal']).value,
            weightUnits: this.form.get(['weightUnits']).value,
            user: this.form.get(['user']).value,
        };
    }

    compareUser(first: User, second: User): boolean {
        return first && second ? first.id === second.id : first === second;
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

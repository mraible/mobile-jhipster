import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BloodPressure } from './blood-pressure.model';
import { BloodPressureService } from './blood-pressure.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'page-blood-pressure-update',
    templateUrl: 'blood-pressure-update.html'
})
export class BloodPressureUpdatePage implements OnInit {

    bloodPressure: BloodPressure;
    users: User[];
    timestamp: string;
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        timestamp: [null, [Validators.required]],
        systolic: [null, [Validators.required]],
        diastolic: [null, [Validators.required]],
        user: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private userService: UserService,
        private bloodPressureService: BloodPressureService
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
            this.bloodPressure = response.data;
            this.isNew = this.bloodPressure.id === null || this.bloodPressure.id === undefined;
        });
    }

    updateForm(bloodPressure: BloodPressure) {
        this.form.patchValue({
            id: bloodPressure.id,
            timestamp: (this.isNew) ? new Date().toISOString() : bloodPressure.timestamp,
            systolic: bloodPressure.systolic,
            diastolic: bloodPressure.diastolic,
            user: bloodPressure.user,
        });
    }

    save() {
        this.isSaving = true;
        const bloodPressure = this.createFromForm();
        if (!this.isNew) {
            this.subscribeToSaveResponse(this.bloodPressureService.update(bloodPressure));
        } else {
            this.subscribeToSaveResponse(this.bloodPressureService.create(bloodPressure));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<BloodPressure>>) {
        result.subscribe((res: HttpResponse<BloodPressure>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `BloodPressure ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/blood-pressure');
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

    private createFromForm(): BloodPressure {
        return {
            ...new BloodPressure(),
            id: this.form.get(['id']).value,
            timestamp: new Date(this.form.get(['timestamp']).value),
            systolic: this.form.get(['systolic']).value,
            diastolic: this.form.get(['diastolic']).value,
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

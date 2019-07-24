import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Points } from './points.model';
import { PointsService } from './points.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
    selector: 'page-points-update',
    templateUrl: 'points-update.html'
})
export class PointsUpdatePage implements OnInit {

    points: Points;
    users: User[];
    dateDp: any;
    isSaving = false;
    isNew = true;
    isReadyToSave: boolean;

    form = this.formBuilder.group({
        id: [],
        date: [null, [Validators.required]],
        exercise: [null, []],
        meals: [null, []],
        alcohol: [null, []],
        notes: [null, []],
        user: [null, []],
    });

    constructor(
        protected activatedRoute: ActivatedRoute,
        protected navController: NavController,
        protected formBuilder: FormBuilder,
        public platform: Platform,
        protected toastCtrl: ToastController,
        private userService: UserService,
        private pointsService: PointsService
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
            this.points = response.data;
            this.isNew = this.points.id === null || this.points.id === undefined;
            if (this.isNew) {
                this.points.date = new Date().toISOString().split('T')[0];
                this.points.alcohol = 1;
                this.points.exercise = 1;
                this.points.meals = 1;
                this.updateForm(this.points);
            }
        });
    }

    updateForm(points: Points) {
        this.form.patchValue({
            id: points.id,
            date: points.date,
            exercise: points.exercise,
            meals: points.meals,
            alcohol: points.alcohol,
            notes: points.notes,
            user: points.user,
        });
    }

    save() {
        this.isSaving = true;
        const points = this.createFromForm();

        // convert booleans to ints
        points.exercise = points.exercise ? 1 : 0;
        points.meals = points.meals ? 1 : 0;
        points.alcohol = points.alcohol ? 1 : 0;

        if (!this.isNew) {
            this.subscribeToSaveResponse(this.pointsService.update(points));
        } else {
            this.subscribeToSaveResponse(this.pointsService.create(points));
        }
    }

    protected subscribeToSaveResponse(result: Observable<HttpResponse<Points>>) {
        result.subscribe((res: HttpResponse<Points>) => this.onSaveSuccess(res), (res: HttpErrorResponse) => this.onError(res.error));
    }

    async onSaveSuccess(response) {
        let action = 'updated';
        if (response.status === 201) {
          action = 'created';
        }
        this.isSaving = false;
        const toast = await this.toastCtrl.create({message: `Points ${action} successfully.`, duration: 2000, position: 'middle'});
        toast.present();
        this.navController.navigateBack('/tabs/entities/points');
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

    private createFromForm(): Points {
        return {
            ...new Points(),
            id: this.form.get(['id']).value,
            date: this.form.get(['date']).value,
            exercise: this.form.get(['exercise']).value,
            meals: this.form.get(['meals']).value,
            alcohol: this.form.get(['alcohol']).value,
            notes: this.form.get(['notes']).value,
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

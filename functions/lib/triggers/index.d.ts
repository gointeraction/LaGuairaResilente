import * as functions from 'firebase-functions';
export declare const onUserCreated: functions.CloudFunction<functions.firestore.QueryDocumentSnapshot>;
export declare const onEnrollmentCompleted: functions.CloudFunction<functions.Change<functions.firestore.QueryDocumentSnapshot>>;
export declare const onSponsorshipCreated: functions.CloudFunction<functions.firestore.QueryDocumentSnapshot>;
export declare const onMilestoneCompleted: functions.CloudFunction<functions.Change<functions.firestore.QueryDocumentSnapshot>>;
export declare const onRedemptionCreated: functions.CloudFunction<functions.firestore.QueryDocumentSnapshot>;
export declare const onCampUpdated: functions.CloudFunction<functions.Change<functions.firestore.QueryDocumentSnapshot>>;
//# sourceMappingURL=index.d.ts.map
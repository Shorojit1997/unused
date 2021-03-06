
const query = require('./query');

const Admins=require('../models/Admins')
const Appointments=require('../models/Appointments');
const Address=require('../models/Address')

const Blogs =require('../models/Blogs');

const Comments=require('../models/Comment');
const Clinic=require('../models/Clinics');
const Clinic_has_Doctor=require('../models/Clinic_has_Doctor');
const Colors=require('../models/Colors')


const DoctorAuth = require('../models/DoctorAuth');
const DoctorInfo=require('../models/DoctorInfo');

const Educations=require('../models/Educations')
const Experience=require('../models/Experience');

const Helplines=require('../models/Helplines')

const Informations=require('../models/Informations')

const Medicle_reports=require('../models/Medicle_report');
const Medicne =require('../models/Medicines');

const Upload=require('../models/Uploads')

const Patients=require('../models/Patient')
const PatientAuth=require('../models/PatientAuth');
const Reviews=require('../models/Reviews');


const Prescriptions=require('../models/Prescriptions');
const Patients_has_Ratings=require('../models/Patient_has_Ratings');

const Ratings =require('../models/Ratings');
const Transactions=require('../models/Transactions');


module.exports=async()=>{
    try{

        await query(Address);
        await query(DoctorInfo);
        await query(DoctorAuth);

        await query(Educations);
        await query(Experience);

        await query(Blogs);

        await query(Patients);
        await query(PatientAuth);
        await query(Reviews);
        await query(Comments);

        await query(Appointments);
        await query(Prescriptions);
        await query(Medicne);
        await query(Medicle_reports);
        await query(Ratings);
        await query(Patients_has_Ratings);
        await query(Clinic);
        await query(Clinic_has_Doctor);
        await query(Transactions);
        await query(Helplines);
        await query(Colors);
        await query(Informations);
        await query(Admins);
        await query(Upload);
        console.log('Successfully Created All Tables\n');
        
    }
    catch(e){
        console.log(e);
        console.log('Somethings wrongs\n');
    }
}
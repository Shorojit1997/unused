
function AcceptPatientRequest(element) {

    var id = element.id;
    var dateId = document.getElementById('date13')

    $.post('/dashboard/accept', { date: dateId, appointmentId: id }, function (status, data) {

        element.parentNode.parentNode.remove();

    })

}

function ShowDoctorList(element) {
    var activelist = document.querySelectorAll('#myButton > *');
    activelist.forEach(function (ele) {
        ele.classList.remove('btn-warning');
        ele.classList.add('btn-light');
    });
    element.classList.remove('btn-light')
    element.classList.add('btn-warning');
}

function addReport(appointmentId) {

    var reportSection = document.getElementById('reportSection');
    var report = document.getElementById('reportName');
    var reportName = report.value.trim();

    if (reportName != '') {

        var newEle = document.createElement('div');
        newEle.classList.add('row', 'w-100', 'm-0', 'p-0')
        newEle.innerHTML = `
    <div class="col-8" >${reportName}</div>
    <div class="col-4">
        <button onclick="removeReport(this)" class="btn btn-sm btn-outline-danger m-1">Delete</button>
    </div>`

        reportSection.appendChild(newEle);

        $.post('/dashboard/view/prescription/reports/add', { ReportName: reportName, appointmentId: appointmentId }).done(function (data) {
            report.value = ' '

        }).fail(function (err, ht, h) {
            reportSection.removeChild(newEle);
        })
    }

}

function removeReport(element, ReportId) {
    var newNode = element.parentNode.parentNode;
    if (newNode != null) {
        newNode.remove();
        $.post('/dashboard/view/prescription/reports/delete', { ReportId }).done(function (data) {


        }).fail(function (err, ht, h) {
            newNode.appendChild(element);
        })
    }

}



function addMedicine(appointmentId) {


    var reportSection = document.getElementById('medicineSection');
    var Type = document.getElementById('Type').value;
    var MedicineName = document.getElementById('MedicineName').value;
    var Duration = document.getElementById('Duration').value;
    var Note = document.getElementById('Note').value;


    if (Type != '' && MedicineName != '' && Duration != '') {

        var newEle = document.createElement('div');
        newEle.classList.add('d-flex', 'flex-column', 'justify-content-center', 'w-100');

        newEle.innerHTML = `
        <div class="row w-100 m-0 p-0">
        <div class="col-2" style="font-weight:bold;font-style: italic;">
            ${Type} :
        </div>
        <div class="col-6">
            ${MedicineName}
        </div>
        <div class="col-2">
            ${Duration} 
        </div>
        <div class="col-2">
            <button onclick="removeMedicine(this)"
                class="btn btn-sm btn-outline-danger">Delete</button>


        </div>
    </div>
    <div class="row w-100 notes">
        <div class="col-3"></div>
        <div class="col-9">  ${Note}</div>
    </div>`

        reportSection.appendChild(newEle);

        $.post('/dashboard/view/prescription/medicine/add',
            {
                MedicineName: MedicineName,
                Type: Type,
                Duration: Duration,
                Note: Note,
                appointmentId: appointmentId

            }).done(function (data) {


            }).fail(function (err, ht, h) {
                reportSection.removeChild(newEle);
            })
    }

}

function removeMedicine(element, MedicineId) {
    var newNode = element.parentNode.parentNode.parentNode;
    if (newNode != null) {
        newNode.remove();
        $.post('/dashboard/view/prescription/medicine/delete', { MedicineId }).done(function (data) {
        }).fail(function (err, ht, h) {
            newNode.appendChild(element);
        })
    }

}


function getPrescriptonDetails(AppointmentId) {
    var PrescriptionSection = document.getElementById('PrescriptionSection');
    $.post('/dashboard/view/prescription/details', { AppointmentId }).done(function (data) {
        PrescriptionSection.innerHTML = generateFile(data);

    }).fail(function (err, ht, h) {

    })
}

function generateFile(data) {

    const { DoctorName, Medicine, MedicleReports } = data.data;

    return `<div class="d-flex justify-content-center flex-column">
    <div style="border-bottom: 1px solid rgb(212, 210, 210); font-size: 22px; font-weight: 600;">
        Dr ${DoctorName[0].Name}
    </div>

    <div id="viewId" class="row" style="height: 400px;">
        

        <div class="col-3" style="border-right: 2px solid gray; height: 400px;">
            <div
            style="font-size:18px;font-weight: bold; text-decoration: underline;font-style: italic;">
            Medicle Test</div>
            <!-- reports section for doctor  -->
            <div id="reportSection"
                class="d-flex flex-column mt-4 justify-content-start align-items-start">
                ${MedicleReports.map(function (element) {
        return `
                    <div class="row w-100 m-0 p-0">
                    <div class="col-8">
                        ${element.ReportName}
                    </div>
                    
                </div>`
    }).join(' ')}
            </div>

        </div>
        <div class="col-7">
            <div
            style="font-size:18px;font-weight: bold; text-decoration: underline;font-style: italic;">
            Medicine</div>
            <!-- medicine sections  -->
            <div id="medicineSection"
                class="d-flex flex-column mt-4 justify-content-start align-items-start">
                ${Medicine.map(function (element) {
        return `
                    <div class="d-flex flex-column justify-content-center w-100" style="font-size: 16px;">
                    <div class="row w-100 m-1 p-0">
                        <div class="col-2" style="font-weight: bold; font-style: italic;">
                            ${element.Type} :
                        </div>
                        <div class="col-6">
                            ${element.MedicineName}
                        </div>
                        <div class="col-2">
                            ${element.Duration} times
                        </div>
                        
                    </div>
                    <div class="row w-100 notes" >
                        <div class="col-3"></div>
                        <div class="col-9">${element.Note}</div>
                       
                    </div>
                </div>`
    }).join(' ')}
              
            </div>

        </div>

    </div>
</div>
</div>
    
    `
}

function showAppointment(AppointmentId) {
    var viewId=document.getElementById("viewId");

    $.get('/dashboard/view/appointment_details', { AppointmentId }).done(function (data) {
        viewId.innerHTML=genereateTable(data);
    }).fail(function (err, ht, h) {
       
    })
}


function genereateTable(data){

    console.log(data)
   
        return `
        <table class="table table-bordered">
                                <thead class=" table-dark">
                                    <tr>
                                        <th>Doctor_Name</th>
                                        <th>Problem</th>
                                        <th>VisitAt</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                ${ data.data.AppointmentDetails.map(function(element){
                                     return `
                                        <tr>
                                            <td>${element.Name}</td>
                                            <td>${element.ProblemDesctiption}</td>
                                            <td>${element.VisitAt} </td>
                                            <td> ${element.Date}</td>
                                            <td><button onclick="getPrescriptonDetails(${element.AppointmentId})" class="btn btn-sm btn-success">View</button> </td>
                                        </tr>
                                        `
                                })}
                                    
                                </tbody>
                            </table>`
    
}


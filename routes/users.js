'use strict'
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/ward/:wardID', (req, res, next) => {
    let db = req.db;
    let ward = req.params.wardID;
    let sql = `select i.hn,i.regist_flag,i.ladmit_n,CAST(RTRIM(t.titleName) + RTRIM(p.firstName) + '  ' + RTRIM(p.lastName) AS CHAR(50)) AS Name,w.ward_id,w.ward_name,dbo.ymd2cbe(i.admit_date) as date,dbo.nowage(p.birthDay,dbo.ce2ymd(getdate()))as age from Ipd_h i left join PATIENT p on (p.hn=i.hn) left join Ward w on(w.ward_id = i.ward_id) LEFT JOIN PTITLE t ON (p.titleCode = t.titleCode) where i.ward_id = ?  and i.discharge_status='0' order by p.firstName asc`;
    db.raw(sql, [ward])
        .then(rows => {
            //let dba= db.raw(sql, [ward]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/ward', (req, res, next) => {
    let db = req.db;
    let sql = `select * from Ward order by ward_name asc`;
    db.raw(sql, [])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/PATIENT/:hn', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let sql = `select top 1 p.hn,b.regNo,t.titleName+p.firstName+' '+p.lastName as FullName,p.sex,pt.pay_typedes,dbo.nowage(p.birthDay,dbo.ce2ymd(getdate()))as age,dbo.ymd2cbe(p.birthDay) as dob from PATIENT p LEFT JOIN PTITLE t on (p.titleCode=t.titleCode) LEFT JOIN Bill_h b on (p.hn=b.hn) LEFT JOIN Paytype pt on b.useDrg=pt.pay_typecode WHERE p.hn=? ORDER BY b.regNo desc`;
    db.raw(sql, [hn])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/OPD_H/:hn', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let sql = `select h.hn,dbo.ymd2cbe(h.registDate) as registDay,d.deptDesc,h.regNo from OPD_H h left join DEPT d on (h.dept=d.deptCode) where h.hn=? order by h.regNo desc`;
    db.raw(sql, [hn])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/ScanCard/:hn/:regNo', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let regNo = req.params.regNo;
    let sql = `select HN,RegNo,DeptCode,DocType,PictFile from ScanCard where HN=? and RegNo=?`;
    db.raw(sql, [hn,regNo])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/VitalSign/:hn/:regNo', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let regNo = req.params.regNo;
    let sql = `select hn,RegNo,VitalSignNo,Weight,Height,Lbloodpress,Hbloodpress,Temperature,Symtom,Pulse,Breathe,Smoke,Alchohol,Headcircumference,waistline,hip,BMI,foot,eye,deptCode,foot_assess,eye_defect from VitalSign where hn=? and RegNo=?`;
    db.raw(sql, [hn,regNo])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/PATDIAG/:hn/:regNo', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let regNo = req.params.regNo;
    let sql = `select p.Hn,p.regNo,p.DocCode,p.ICDCode,p.DiagNote,p.deptCode,i.DES from PATDIAG p left join ICD101 i on (p.ICDCode=i.CODE)  where Hn=? and regNo=?`;
    db.raw(sql, [hn,regNo])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/PATDIAG/:hn/:regNo', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let regNo = req.params.regNo;
    let sql = `select p.Hn,p.regNo,p.DocCode,p.ICDCode,p.DiagNote,p.deptCode,i.DES from PATDIAG p left join ICD101 i on (p.ICDCode=i.CODE)  where Hn=? and regNo=?`;
    db.raw(sql, [hn,regNo])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/Labres_d/:hn/:regNo', (req, res, next) => {
    let db = req.db;
    let hn = req.params.hn;
    let regNo = req.params.regNo;
    let sql = `select d.hn,d.reg_flag,d.req_no,d.lab_code,d.organism,d.res_item,d.result_name,d.lab_type,d.resNormal,d.real_res,s.result_unit,s.low_normal,s.high_normal from Labres_d d left join Labre_s s on d.lab_code=s.lab_code and d.lab_type=s.labType where d.hn=? and d.reg_flag=?`;
    db.raw(sql, [hn,regNo])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

router.get('/Appoint/:strdate/:stpdate/:doctor/:deptcode', (req, res, next) => {
    let db = req.db;
    let strdate = req.params.strdate;
    let stpdate = req.params.stpdate;
    let doctor = req.params.doctor;
    let deptcode = req.params.deptcode;   
    let sql = `SELECT a.hn,RTRIM(t.titleName)+RTRIM(p.firstName)+' '+RTRIM(p.lastName) as FullName,dp.deptDesc,RTRIM(d.docName)+' '+d.docLName as docname FROM Appoint a left join PATIENT p on a.hn=p.hn left join PTITLE t on p.titleCode=t.titleCode left join DEPT dp on a.pre_dept_code=dp.deptCode left join DOCC d on a.doctor=d.docCode where (a.appoint_date between ? and ?) and a.doctor=? and a.pre_dept_code=?`;
    db.raw(sql, [stpdate,stpdate,doctor,deptcode])
        .then(rows => {
            //let dba= db.raw(sql, [hn]).toString();
            res.send({
                ok: true,
                rows: rows
            })
        })
        .catch(err => {
            console.log(err)
                //let dba= db.raw(sql, [fields, search]).toString();
            res.send({
                ok: false,
                msg: `[${err.code}] ${err.message}`
            })
        });
})

module.exports = router;
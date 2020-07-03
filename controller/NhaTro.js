'use strict'

const util = require('util')
const mysql = require('mysql')
const conn = require('../connection')
const fs = require('fs')
const mime = require('mime')
var jwt=require('jsonwebtoken');
let multer = require("multer");
let path = require("path");

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "upload");
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({storage: diskStorage}).any("file");

let Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "uploadavatar");
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFileavatar = multer({storage: Storage}).single("fileavatar");

function getAllpost(req, res, next) {
    var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,Tenquan,Tenthanhpho,LocalX,LocalY,DATE_FORMAT(Date,"%d/%m/%Y")
    as date,Sate,Dientich,Phong,Nhavesinh,Mota,
    Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,avg(Vote) as vote 
        from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt, quanlynhatro01.tbl_quan,quanlynhatro01.tbl_thanhpho,
        (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image, quanlynhatro01.tbl_danhgia
        where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idQuan=tbl_quan.idQuan and tbl_nhatro.idThanhpho=tbl_thanhpho.idThanhpho 
        and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=tbl_danhgia.idNhatro and Sate=1
        group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
      if (err) {
        res.status(201).json('error');
      } else {
        res.status(200).json(rows);
      }
    });
}

function Uploadfile(req, res, next) {
  uploadFile(req, res, (error) => {
    // Nếu có lỗi thì trả về lỗi cho client.
    // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
    if (error) {
      return res.status(201).json('error');
    }
    // Không có lỗi thì lại render cái file ảnh về cho client.
    // Đồng thời file đã được lưu vào thư mục uploads
    for(var i=0;i<req.files.length;i++){
      console.log(req.files[i].filename)
    }
    return res.status(201).json('thanh cong');
  });
}

function DangTro(req, res, next){
  uploadFile(req, res, (error) => {
    if (error) {
      return res.status(201).json('error');
    }
    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_nhatro(Tenchutro,Sdt,Diachi,idQuan,idThanhpho,LocalX,LocalY,Date,Sate,Title)
      values('${req.body.Tenchutro}','${req.body.Sdt}','${req.body.Diachi}','${req.body.idQuan}','${req.body.idThanhpho}',
      '${req.body.LocalX}','${req.body.LocalY}','${req.body.Date}','0','${req.body.Title}');`, function(err,rows){
        if(err){
        return res.status(201).json({data:'Error'});
      }
    });
    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_chitietnt(Dientich,Phong,Nhavesinh,Mota,Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,wifi,gio,chungchu)
      values('${req.body.Dientich}','${req.body.Phong}','${req.body.Nhavesinh}','${req.body.Mota}','${req.body.Gia}',
      '${req.body.Maylanh}','${req.body.Giuxe}','${req.body.Nuocnong}','${req.body.Dien}','${req.body.Nuoc}',
      '${req.body.Loainha}','${req.body.wifi}','${req.body.gio}','${req.body.chungchu}');`, function(err,rows){
        if(err){
        return res.status(201).json({data:'Error'});
      }
    });
    var query=conn.query(`SELECT max(idNhatro) as id FROM quanlynhatro01.tbl_nhatro;`, function(err,rows){
        if(err){
        return res.status(201).json({data:'Error'});
      }
      else{
        var id = rows[0].id
        for(var i=0;i<req.files.length;i++){
            console.log(i)
            var imageName = "https://quanlynhatro01.herokuapp.com/loadhinhanhnhatro?image_name="
            imageName += req.files[i].filename;
            var query=conn.query(`INSERT INTO quanlynhatro01.tbl_hinhanh(idNhatro,Hinhanh)
            values('${id}','${imageName}');`, function(err,rowss){
              console.log(id)
              if(err){
              return res.status(201).json({data:'Error'});
            }
          });
        }
      }
    });
    return res.status(201).json({data:'thanh cong'});
  });
}

function getpostid(req, res, next) {
  var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,Tenquan,Tenthanhpho,LocalX,LocalY,DATE_FORMAT(Date,"%d/%m/%Y")
  as date,Sate,Dientich,Phong,Nhavesinh,Mota,
        Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,avg(Vote) as vote 
            from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt, quanlynhatro01.tbl_quan,quanlynhatro01.tbl_thanhpho,
            (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image, quanlynhatro01.tbl_danhgia
            where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idQuan=tbl_quan.idQuan and tbl_nhatro.idThanhpho=tbl_thanhpho.idThanhpho 
            and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=tbl_danhgia.idNhatro and tbl_nhatro.idNhatro=${req.params.id} and Sate=1
            group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
          if (err) {
            res.status(201).json('error');
          } else {
            res.status(200).json(rows[0]);
          }
        }); 
}

function loadhinhanh(req,res,next){
    console.log(req.query.image_name)
    let imageName = "uploadavatar/" + req.query.image_name;
    fs.readFile(imageName,(err,ImageData)=>{
      if(err){
        res.status(201).json({data:"Error"})
      }else{
        res.writeHead(200,{'Content-type':'image/jpeg'});
        res.end(ImageData)
      }
    })
}

function loadhinhanhnhatro(req,res,next){
  console.log(req.query.image_name)
  let imageName = "upload/" + req.query.image_name;
  fs.readFile(imageName,(err,ImageData)=>{
    if(err){
      res.status(201).json({data:"Error"})
    }else{
      res.writeHead(200,{'Content-type':'image/jpeg'});
      res.end(ImageData)
    }
  })
}

function Dsachcomment(req,res,next){
  var query = conn.query(`SELECT idNhatro,Noidung,idNguoidung,tbl_userinfor.Ten,tbl_userinfor.photo,DATE_FORMAT(date,"%d/%m/%Y") as date
  FROM quanlynhatro01.tbl_bl_nhatro, quanlynhatro01.tbl_binhluan,quanlynhatro01.tbl_bl_nguoidung,quanlynhatro01.tbl_userinfor
  where tbl_bl_nhatro.idBinhluan=tbl_binhluan.idBinhluan and tbl_bl_nguoidung.idBinhluan = tbl_bl_nhatro.idBinhluan 
  and tbl_userinfor.idUser=tbl_bl_nguoidung.idNguoidung and tbl_bl_nhatro.idNhatro=${req.params.id};`, function (err, rows) {
            if (err) {
              res.status(201).json('error');
            } else {
              res.status(200).json(rows);
            }
          });
}

function Login(req,res,next){
  try{
        var query=conn.query(`SELECT tbl_user.idUser,Username,Password,Ho,Ten,DATE_FORMAT(Ngaysinh,"%d/%m/%Y") as NgaySinh,
        Diachi,TenQuan,Tenthanhpho,Sdt,photo
        FROM quanlynhatro01.tbl_user,quanlynhatro01.tbl_userinfor,quanlynhatro01.tbl_quan,quanlynhatro01.tbl_thanhpho
        where tbl_user.idUser=tbl_userinfor.idUser and tbl_userinfor.Quan=quanlynhatro01.tbl_quan.idQuan 
        and tbl_userinfor.Thanhpho=tbl_thanhpho.idThanhPho;`, function(err,rows){
          if(err){
            res.status(201).json({data:'Error'});
          }else{
              var dem=0;
              var tam=rows.length;
              var flag=false;
              while(tam!=0)
              {
                  var Username=rows[dem].Username;
                  var Password=rows[dem].Password;
                  if(req.body.Username==Username && req.body.Password==Password)
                  {
                      var token = jwt.sign({ten:'abc'},'abc',{algorithm:'HS256',expiresIn: '3h'});
                      res.status(200).json({access_token:token,...rows[dem]});
                      flag=true;
                      break;
                  }
                  dem++;
                  tam--;
              };
              if(flag==false)
              {
                res.status(200).json({data:'Error'});
              }
          }
        });
      }catch{
        return res.status(201).json({data:'Error'});
      }
}

function LoginGoogle(req,res,next){
  try{
    var query=conn.query('SELECT Username,Password FROM quanlynhatro01.tbl_user;', function(err,rows){
      if(err){
        return res.status(201).json({data:'Error'});
      }else{
          var dem=0;
          var tam=rows.length;
          var flag=false;
          while(tam!=0)
          {
              var Username=rows[dem].Username;
              var Password=rows[dem].Password;
              if(req.body.gmail==Username && req.body.id==Password)
              {
                  var token = jwt.sign({ten:Username},'abc',{algorithm:'HS256',expiresIn: '3h'});
                  res.status(201).json({access_token:token});
                  flag=true;
                  break;
              }
              dem++;
              tam--;
          };

          if(flag==false)
          {
            var query=conn.query(`INSERT INTO quanlynhatro01.tbl_userinfor(Ho,Ten,photo)
              values('${req.body.Ho}','${req.body.Ten}','${req.body.photourl}');`, function(err,rows){
                if(err){
                  return res.status(201).json({data:'Error'});
                }
            });

            var query=conn.query(`INSERT INTO quanlynhatro01.tbl_user(Username,Password)
              values('${req.body.gmail}','${req.body.id}');`, function(err,rows){
                if(err){
                  return res.status(201).json({data:'Error'});
                }
            });
            var token = jwt.sign({ten:req.body.gmail},'abc',{algorithm:'HS256',expiresIn: '3h'});
            res.status(201).json({access_token:token});
          }
      }
    });
  }catch{
    return res.status(201).json({data:'Error'});
  }
}

function DoiMK(req,res,next){
  if(req.headers && req.headers.authorization && String(req.headers.authorization.split(' ')[0]).toLowerCase()=== 'bearer'){
    var token =req.headers.authorization.split(' ')[1];
    jwt.verify(token,'abc',function(err,decode){
      var query=conn.query('SELECT Username,Password FROM quanlynhatro01.tbl_user;', function(err,rows){
        if(err){
          return res.status(201).json({data:'Error'});
        }else{
            var dem=0;
            var tam=rows.length;
            var flag=false;
            while(tam!=0)
            {
                var Username=rows[dem].Username;
                var Passwordold=rows[dem].Password;
                if(req.body.Username==Username && req.body.current_password==Passwordold)
                {
                    var query=conn.query(`UPDATE quanlynhatro01.tbl_user 
                    SET Password = '${req.body.new_password}' 
                    WHERE (idUser = ${req.params.id});`,function(err,rows){
                      if(err){
                        throw err;
                      }else{
                        res.status(200).json({data:"Thanh Cong"});
                      }
                    });
                    flag=true;
                    break;
                }
                dem++;
                tam--;
            };
            if(flag==false)
            {
              res.status(201).json({data:"Khong thanh cong"});
            }
        }
      });  
    });
  }else{
    res.status(201).json({data:'Error'});
  }
}

function DangKy(req,res,next){
   var query=conn.query('SELECT Username,Password FROM quanlynhatro01.tbl_user;', function(err,rows){
    if(err){
      return res.status(201).json({data:'Error'});
    }else{
        var dem=0;
        var tam=rows.length;
        var flag=false;
        while(tam!=0)
        {
            var Username=rows[dem].Username;
            if(req.body.email==Username)
            {
                res.status(200).json({data:'Da Dang Ky'});
                flag=true;
                break;
            }
            dem++;
            tam--;
        };
        if(flag==false)
        {
          var imageName = "https://quanlynhatro01.herokuapp.com/loadhinhanh?image_name="
          uploadFileavatar(req, res, (error) => {
            if (error) {
              return res.status(201).json('error');
            }
             imageName += req.file.filename;
             console.log(imageName)
             console.log(req.body.Ho)
             var query=conn.query(`INSERT INTO quanlynhatro01.tbl_userinfor(Ho,Ten,Ngaysinh,Diachi,Quan,Thanhpho,Sdt,photo)
              values('${req.body.Ho}','${req.body.Ten}','${req.body.NgaySinh}','${req.body.DiaChi}','${req.body.Quan}','${req.body.ThanhPho}',
              '${req.body.Sdt}','${imageName}');`, function(err,rows){
                if(err){
                  return res.status(201).json({data:'Error'});
                }
              });
              var query=conn.query(`INSERT INTO quanlynhatro01.tbl_user(Username,Password)
                  values('${req.body.email}','${req.body.pass}');`, function(err,rows){
                    if(err){
                      return res.status(201).json({data:'Error'});
                    }
              });
          });
          res.status(200).json({data:'Dang Ky Thanh Cong'});
        }
    }
  });
}

function Search(req, res, next) {   
  var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,Tenquan,Tenthanhpho,LocalX,LocalY,DATE_FORMAT(Date,"%d/%m/%Y") as date,Sate,Dientich,Phong,Nhavesinh,Mota,
  Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,avg(Vote) as vote 
      from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt, quanlynhatro01.tbl_quan,quanlynhatro01.tbl_thanhpho,
      (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image, quanlynhatro01.tbl_danhgia
      where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idQuan=tbl_quan.idQuan and tbl_nhatro.idThanhpho=tbl_thanhpho.idThanhpho 
      and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=tbl_danhgia.idNhatro and tbl_nhatro.Diachi like '%${req.query.address}%' and Sate=1
      group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
          if (err) {
            res.status(201).json({data:'error'});
          } else {
              res.status(200).json(rows);
          }
        }); 
}

function Filter(req, res, next) {   
  var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,Tenquan,Tenthanhpho,LocalX,LocalY,
      DATE_FORMAT(Date,"%d/%m/%Y") as date,Sate,Dientich,Phong,Nhavesinh,Mota,
      Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,Dgia.vote
      from (select idNhatro, avg(Vote) as vote  
			from quanlynhatro01.tbl_danhgia 
			group by quanlynhatro01.tbl_danhgia.idNhatro) as Dgia,
      quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt, quanlynhatro01.tbl_quan,quanlynhatro01.tbl_thanhpho,
      (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image
      where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idQuan=tbl_quan.idQuan 
      and tbl_nhatro.idThanhpho=tbl_thanhpho.idThanhpho and Sate=1
      and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=Dgia.idNhatro and tbl_nhatro.Diachi like '%${req.body.adrress}%' 
      and tbl_nhatro.idQuan=${req.body.quan} and tbl_nhatro.idThanhpho=1 and Dgia.vote=${req.body.rating}
      and (tbl_chitietnt.Gia>=${req.body.minprice} and tbl_chitietnt.Gia<=${req.body.maxprice}) 
      and (tbl_chitietnt.Dientich>=${req.body.minarea} and tbl_chitietnt.Dientich<=${req.body.maxarea})
      and tbl_chitietnt.Giuxe=${req.body.giuxe} and tbl_chitietnt.Nuocnong=${req.body.nuocnong} 
      and tbl_chitietnt.Maylanh=${req.body.maylanh} and tbl_chitietnt.wifi=${req.body.wifi} 
      and tbl_chitietnt.gio=${req.body.gio} and tbl_chitietnt.chungchu=${req.body.chungchu}
      group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
          if (err) {
            res.status(201).json({data:'error'});
          } else {
              res.status(200).json(rows);
          }
        }); 
}

function DSNhaTroUser(req,res,next){
  var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,Tenquan,Tenthanhpho,
        LocalX,LocalY,DATE_FORMAT(Date,"%d/%m/%Y") as date,Sate,Dientich,Phong,Nhavesinh,Mota,
        Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,avg(Vote) as vote 
        from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt, quanlynhatro01.tbl_quan,
        quanlynhatro01.tbl_thanhpho,quanlynhatro01.tbl_qlnhatro,
        (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image, quanlynhatro01.tbl_danhgia
        where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idQuan=tbl_quan.idQuan 
        and tbl_nhatro.idThanhpho=tbl_thanhpho.idThanhpho 
        and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=tbl_danhgia.idNhatro 
        and tbl_qlnhatro.idNhatro=tbl_nhatro.idNhatro and tbl_qlnhatro.idUser=${req.params.id} and Sate=1
        group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
      if (err) {
        res.status(201).json({data:'error'});
      } else {
        res.status(200).json(rows);
      }
    });
}

function ListImage(req, res, next) {   
  var query = conn.query(`select *
  from quanlynhatro01.tbl_hinhanh
  where idNhatro = ${req.params.id}`, function (err, rows) {
          if (err) {
            res.status(201).json({data:'error'});
          } else {
            if(rows[0].idnhatro!=null){
              res.status(200).json(rows[0]);
            }
          }
        }); 
}

function EditNhaTro(req, res,next){
  var query = conn.query(`UPDATE quanlynhatro01.tbl_nhatro SET Tenchutro = '${req.body.Tenchutro}', Sdt = '${req.body.Sdt}',
   Diachi = '${req.body.DiaChi}', idQuan = ${req.body.idQuan} , idThanhpho = 1,LocalX = ${req.body.LocalX}, LocalY = ${req.body.LocalY},
   Date = '${req.body.Date}', Title = '${req.body.Title}' WHERE (idNhatro = ${req.params.idnhatro});`, function (err, rows) {
          if (err) {
            res.status(201).json({data:'error'});
          } else {
            res.status(200).json({data:'Thành Công'});
          }
        }); 
}

module.exports = {
    Login:Login,
    LoginGoogle:LoginGoogle,
    getAllpost:getAllpost,
    Uploadfile:Uploadfile,
    getpostid:getpostid,
    loadhinhanh:loadhinhanh,
    Dsachcomment:Dsachcomment,
    DoiMK:DoiMK,
    DangKy:DangKy,
    DangTro:DangTro,
    loadhinhanhnhatro:loadhinhanhnhatro,
    Search:Search,
    Filter:Filter,
    DSNhaTroUser:DSNhaTroUser,
    ListImage:ListImage,
    EditNhaTro:EditNhaTro   
}
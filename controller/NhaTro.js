'use strict'

const util = require('util')
const mysql = require('mysql')
const conn = require('../connection')
const fs = require('fs')
const mime = require('mime')
var jwt=require('jsonwebtoken');
let multer = require("multer");
let path = require("path");

const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '71e025b3',
  apiSecret: 'N0pr3bteriAKqKYS',
});

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, "upload");
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
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
    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});
// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFileavatar = multer({storage: Storage}).single("fileavatar");

function getAllpost(req, res, next) {
    var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,idQuan,
    idThanhpho,LocalX,LocalY,date_format(Date,"%Y-%m-%d") as date,Dientich,Phong,Nhavesinh,Mota,
    Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,round(danhgia.vote,1) as Vote
    from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt,
    (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image,
    (SELECT idNhatro,avg(Vote) as vote FROM quanlynhatro01.tbl_danhgia group by idNhatro) as danhgia, quanlynhatro01.tbl_danhgia
    where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=danhgia.idNhatro and Sate=1
    group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
      if (err) {
        res.status(201).json('error');
      } else {
        res.status(200).json(rows);
      }
    });
}

function getpostid(req, res, next) {
  var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,idQuan,
  idThanhpho,LocalX,LocalY,date_format(Date,"%Y-%m-%d") as date,Dientich,Phong,Nhavesinh,Mota,
  Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,round(danhgia.vote,1) as Vote
  from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt,
  (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image,
  (SELECT idNhatro,avg(Vote) as vote FROM quanlynhatro01.tbl_danhgia group by idNhatro) as danhgia, quanlynhatro01.tbl_danhgia
  where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idNhatro=image.id 
  and tbl_nhatro.idNhatro=danhgia.idNhatro and tbl_nhatro.idNhatro= ${req.params.id} and Sate=1
  group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
          if (err) {
            res.status(201).json('error');
          } else {
            res.status(200).json(rows[0]);
          }
        }); 
}

function getpostidquan(req, res, next) {
  var query = conn.query(`SELECT tbl_chitietnt.idNhatro,Dientich,Phong,Nhavesinh,
  Maylanh,Giuxe,Nuocnong,wifi,gio,chungchu 
  FROM quanlynhatro01.tbl_chitietnt,quanlynhatro01.tbl_nhatro
  where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idQuan=${req.params.idQuan} and Sate=1;`, function (err, rows) {
      if (err) {
        res.status(201).json({data:'Error'});
      } else {
        var dict = new Object();
        var dict1 = [];
        var start = 0;
        for(var j=start;j<rows.length;j++){
          var tam = Math.pow((rows[0].Dientich-rows[j].Dientich),2)+Math.pow((rows[0].Phong-rows[j].Phong),2)+
          Math.pow((rows[0].Nhavesinh-rows[j].Nhavesinh),2)+Math.pow((rows[0].Maylanh-rows[j].Maylanh),2)+
          Math.pow((rows[0].Giuxe-rows[j].Giuxe),2)+Math.pow((rows[0].Nuocnong-rows[j].Nuocnong),2)+
          Math.pow((rows[0].wifi-rows[j].wifi),2)+Math.pow((rows[0].gio-rows[j].gio),2)+Math.pow((rows[0].chungchu-rows[j].chungchu),2)
          var dolon=Math.sqrt(tam,2)
          dict[rows[j].idNhatro]=dolon;
          dict1[j]=dolon;
          dict1.sort();
        } 
        var dict2=[] 
        for(var h=start;h<5;h++)
        {
          for(var k=start;k<rows.length;k++)
          {
            if(dict1[h]==dict[rows[k].idNhatro]){
              dict2[h]=rows[k].idNhatro;
              break;
            }
          }
        }
        var query = conn.query(`Select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,idQuan,
        idThanhpho,LocalX,LocalY,date_format(Date,"%Y-%m-%d") as date,Dientich,Phong,Nhavesinh,Mota,
        Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,round(danhgia.vote,1) as Vote
        from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt,
        (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image,
        (SELECT idNhatro,avg(Vote) as vote FROM quanlynhatro01.tbl_danhgia group by idNhatro) as danhgia, quanlynhatro01.tbl_danhgia
        where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idNhatro=image.id 
        and tbl_nhatro.idNhatro=danhgia.idNhatro and (tbl_nhatro.idNhatro= ${dict2[0]} or tbl_nhatro.idNhatro= ${dict2[1]}
        or tbl_nhatro.idNhatro= ${dict2[2]} or tbl_nhatro.idNhatro= ${dict2[3]} or tbl_nhatro.idNhatro= ${dict2[4]}) and Sate=1
        group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rowss) {
        if (err) {
          res.status(201).json({data:'Error'});
        } else {
          res.status(200).json(rowss);
        }
      });
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
      return res.status(201).json({data:'Error'});
    }
    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_nhatro(Tenchutro,Sdt,Diachi,idQuan,idThanhpho,LocalX,LocalY,Date,Sate,Title)
      values('${req.body.Tenchutro}','${req.body.Sdt}','${req.body.Diachi}','${req.body.idQuan}','${req.body.idThanhpho}',
      '${req.body.LocalX}','${req.body.LocalY}','${req.body.Date}','0','${req.body.Title}');`, function(err,rows){
        if(err){
        return res.status(201).json({data:'Error'});
      }else{
        var query=conn.query(`INSERT INTO quanlynhatro01.tbl_chitietnt(Dientich,Phong,Nhavesinh,Mota,Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,wifi,gio,chungchu)
            values('${req.body.Dientich}','${req.body.Phong}','${req.body.Nhavesinh}','${req.body.Mota}','${req.body.Gia}',
            '${req.body.Maylanh}','${req.body.Giuxe}','${req.body.Nuocnong}','${req.body.Dien}','${req.body.Nuoc}',
            '${req.body.Loainha}','${req.body.wifi}','${req.body.gio}','${req.body.chungchu}');`, function(err,rows){
              if(err){
              return res.status(201).json({data:'Error'});
            }else{
              var query=conn.query(`SELECT max(idNhatro) as id FROM quanlynhatro01.tbl_nhatro;`, function(err,rows){
                if(err){
                return res.status(201).json({data:'Error'});
              }
              else{
                  var id = rows[0].id
                  for(var i=0;i<req.files.length;i++){
                      var imageName = "http://thomas-nguyen.educationhost.cloud/loadhinhanhnhatro?image_name="
                      imageName += req.files[i].filename;
                      var query=conn.query(`INSERT INTO quanlynhatro01.tbl_hinhanh(idNhatro,Hinhanh)
                      values('${id}','${imageName}');`, function(err,rowss){
                        if(err){
                        return res.status(201).json({data:'Error'});
                      }
                    });
                    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_danhgia(idNguoidung,idNhatro,Vote)
                    values('${req.params.Userid}','${id}','5');`, function(err,rows){
                      if(err){
                        res.status(201).json({data:'Error'});
                      }
                      else{
                        var query=conn.query(`INSERT INTO quanlynhatro01.tbl_qlnhatro(idUser,idNhatro)
                        values('${req.params.Userid}','${id}');`, function(err,rows){
                          if(err){
                            res.status(201).json({data:'Error'});
                          }
                          else{
                            return res.status(201).json({data:'thanh cong'});
                          }
                        });
                      }
                    });
                }
              }
            });
          }
        });
      }
    });
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
  var query = conn.query(`SELECT idNhatro,Noidung,idNguoidung,tbl_userinfor.Ten,tbl_userinfor.photo,date_format(date,"%Y-%m-%d") as date
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
        var query=conn.query(`SELECT tbl_user.idUser,Username,Password,Ho,Ten, date_format(Ngaysinh,"%Y-%m-%d") as NgaySinh,
        Diachi,Quan as idQuan,ThanhPho as idThanhpho,Sdt,photo
        FROM quanlynhatro01.tbl_user,quanlynhatro01.tbl_userinfor
        where tbl_user.idUser=tbl_userinfor.idUser;`, function(err,rows){
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
    var query=conn.query('SELECT * FROM quanlynhatro01.tbl_user;', function(err,rows){
      if(err){
        return res.status(201).json({data:'1'});
      }else{
          var dem=0;
          var tam=rows.length;
          var flag=false;
          while(tam!=0)
          {
              var Username=rows[dem].Username;
              var Password=rows[dem].Password;
              if(req.body.email==Username && req.body.pass==Password)
              {
                  flag=true;
                  console.log(rows[dem].idUser)
                  var query=conn.query(`SELECT tbl_user.idUser,Username,Password,Ho,Ten, 
                  date_format(Ngaysinh,"%Y-%m-%d") as NgaySinh,
                  Diachi,Quan as idQuan,ThanhPho as idThanhpho,Sdt,photo
                  FROM quanlynhatro01.tbl_user,quanlynhatro01.tbl_userinfor
                  where tbl_user.idUser=tbl_userinfor.idUser and tbl_user.idUser=${rows[dem].idUser};`, function(err,rowsss){
                      if(err){
                        return res.status(201).json({data:'2'});
                      }
                      else{
                        var token = jwt.sign({ten:Username},'abc',{algorithm:'HS256',expiresIn: '3h'});
                        return res.status(200).json({access_token:token,...rowsss[0]});
                      }
                  });
                  break;
              }
              dem++;
              tam--;
          };

          if(flag==false)
          {
            var query=conn.query(`INSERT INTO quanlynhatro01.tbl_userinfor(Ho,Ten,photo)
              values('${req.body.Ho}','${req.body.Ten}','${req.body.photourl}');`, function(err,rowss){
                if(err){
                  return res.status(201).json({data:'3'});
                }
            });

            var query=conn.query(`INSERT INTO quanlynhatro01.tbl_user(Username,Password)
              values('${req.body.email}','${req.body.pass}');`, function(err,rowsss){
                if(err){
                  return res.status(201).json({data:'4'});
                }
            });

            var query=conn.query(`SELECT max(idUser) as id FROM quanlynhatro01.tbl_user;`, function(err,rows1){
                if(err){
                  return res.status(201).json({data:'5'});
                }
                else{
                  var id = rows1[0].id
                  console.log
                  var query=conn.query(`SELECT tbl_user.idUser,Username,Password,Ho,Ten, 
                  date_format(Ngaysinh,"%Y-%m-%d") as NgaySinh,
                  Diachi,Quan as idQuan,ThanhPho as idThanhpho,Sdt,photo
                  FROM quanlynhatro01.tbl_user,quanlynhatro01.tbl_userinfor
                  where tbl_user.idUser=tbl_userinfor.idUser and tbl_user.idUser=${id};`, function(err,rowss2){
                      if(err){
                        return res.status(201).json({data:'6'});
                      }
                      else{
                        var token = jwt.sign({ten:req.body.email},'abc',{algorithm:'HS256',expiresIn: '3h'});
                        return res.status(201).json({access_token:token,...rowss2[0]});
                      }
                  });
                }
            });
          }
      }
    });
  }catch{
    return res.status(201).json({data:'7'});
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
  var imageName = "http://thomas-nguyen.educationhost.cloud/loadhinhanh?image_name="
  uploadFileavatar(req, res, (error) => {
    if (error) {
      return res.status(201).json({data:'error'});
    }
    else{
      var query=conn.query('SELECT Username,Password FROM quanlynhatro01.tbl_user;', function(err,rows){
        if(err){
          return res.status(201).json({data:'error'});
        }else{
          var dem=0;
          var tam=rows.length;
          var flag=false;
          console.log(req.body.email)
          while(tam!=0)
          {
              var Username=rows[dem].Username;
              if(req.body.email==Username)
              {
                
                  return res.status(200).json({data:'Da Dang Ky'});
              }
              dem++;
              tam--;
          };
          if(flag==false)
          {
              imageName += req.file.filename;
              var query=conn.query(`INSERT INTO quanlynhatro01.tbl_userinfor(Ho,Ten,Ngaysinh,Diachi,Quan,Thanhpho,Sdt,photo)
                values('${req.body.Ho}','${req.body.Ten}','${req.body.NgaySinh}','${req.body.DiaChi}','${req.body.idQuan}','1',
                '${req.body.Sdt}','${imageName}');`, function(err,rows){
                  if(err){
                    return res.status(201).json({data:'error'});
                  }
                  else{
                    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_user(Username,Password)
                        values('${req.body.email}','${req.body.pass}');`, function(err,rows){
                          if(err){
                            return res.status(201).json({data:'error'});
                          }else{
                            return res.status(200).json({data:'Dang Ky Thanh Cong'});
                          }
                    });
                  }
                });
          }
        }
      });
    }
  });
}

function Search(req, res, next) {   
  var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,idQuan,
  idThanhpho,LocalX,LocalY,date_format(Date,"%Y-%m-%d") as date,Dientich,Phong,Nhavesinh,Mota,
  Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,round(danhgia.vote,1) as Vote
  from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt,
  (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image,
  (SELECT idNhatro,avg(Vote) as vote FROM quanlynhatro01.tbl_danhgia group by idNhatro) as danhgia, quanlynhatro01.tbl_danhgia
  where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idNhatro=image.id 
  and tbl_nhatro.idNhatro=danhgia.idNhatro and tbl_nhatro.Diachi like '%${req.query.address}%' and Sate=1
  group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows) {
    if (err) {
      res.status(201).json({data:'error'});
    } else {
        res.status(200).json(rows);
    }
  }); 
}

function Filter(req, res, next) {   
      var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,idQuan,
      idThanhpho,LocalX,LocalY,date_format(Date,"%Y-%m-%d") as date,Dientich,Phong,Nhavesinh,Mota,
      Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,round(danhgia.vote,1) as Vote
      from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt,
      (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image,
      (SELECT idNhatro,avg(Vote) as vote FROM quanlynhatro01.tbl_danhgia group by idNhatro) as danhgia, quanlynhatro01.tbl_danhgia
      where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro and tbl_nhatro.idNhatro=image.id 
      and tbl_nhatro.idNhatro=danhgia.idNhatro and tbl_nhatro.Diachi like '%${req.body.address}%' 
      and (tbl_chitietnt.Gia>=${req.body.minprice} and tbl_chitietnt.Gia<=${req.body.maxprice})
      and (tbl_chitietnt.Dientich>=${req.body.minarea} and tbl_chitietnt.Dientich<=${req.body.maxarea}) and Sate=1
      group by quanlynhatro01.tbl_nhatro.idNhatro;`, function (err, rows){
      if (err) {
        res.status(201).json({data:'error'});
      } else {
        //filter Quan
        var tam = [];
        if(req.body.idQuan!=0){
          var start=0;
          var dem = 0;
          for(var i=start;i<rows.length;i++){
            if(rows[i].idQuan == req.body.idQuan){
              tam[dem]=rows[i]
              dem=dem+1;
            }
          }
        }else{
          tam=rows
        }
        
        // filter rating
        var tam1=[];
        if(req.body.rating!=null){
          var start1=0;
          var dem1=0;
          for(var i=start1;i<tam.length;i++){
            if(tam[i].Vote >= req.body.rating){
              tam1[dem1]=tam[i]
              dem1=dem1+1;
            }
          }
        }else{
          tam1=tam
        }

        //filter giuxe
        var tam2=[];
        if(req.body.giuxe!=null){
          var start2=0;
          var dem2=0;
          for(var i=start2;i<tam1.length;i++){
            if(tam1[i].Giuxe == req.body.giuxe){
              tam2[dem2]=tam1[i]
              dem2=dem2+1;
            }
          }
        }else{
          tam2=tam1
        }

        //filter req.body.nuocnong
        var tam3=[];
        if(req.body.nuocnong!=null){
          var start3=0;
          var dem3=0;
          for(var i=start3;i<tam2.length;i++){
            if(tam2[i].Nuocnong == req.body.nuocnong){
              tam3[dem3]=tam2[i]
              dem3=dem3+1;
            }
          }
        }else{
          tam3=tam2
        }

        //filter req.body.maylanh
        var tam4=[];
        if(req.body.maylanh!=null){
          var start4=0;
          var dem4=0;
          for(var i=start4;i<tam3.length;i++){
            if(tam3[i].Maylanh == req.body.maylanh){
              tam4[dem4]=tam3[i]
              dem4=dem4+1;
            }
          }
        }else{
          tam4=tam3
        }

        //filter req.body.wifi
        var tam5=[];
        if(req.body.wifi!=null){
          var start5=0;
          var dem5=0;
          for(var i=start5;i<tam4.length;i++){
            if(tam4[i].wifi == req.body.wifi){
              tam5[dem5]=tam4[i]
              dem5=dem5+1;
            }
          }
        }else{
          tam5=tam4
        }

        //filter req.body.gio
        var tam6=[];
        if(req.body.gio!=null){
          var start6=0;
          var dem6=0;
          for(var i=start6;i<tam5.length;i++){
            if(tam5[i].gio == req.body.gio){
              tam6[dem6]=tam5[i]
              dem6=dem6+1;
            }
          }
        }else{
          tam6=tam5
        }

        //filter chungchu
        var tam7=[];
        if(req.body.chungchu!=null){
          var start7=0;
          var dem7=0;
          for(var i=start7;i<tam6.length;i++){
            if(tam6[i].chungchu == req.body.chungchu){
              tam7[dem7]=tam6[i]
              dem7=dem7+1;
            }
          }
        }else{
          tam7=tam6
        }
        res.status(200).json(tam7);
        console.log(tam7);
      }
    });
}

function DSNhaTroUser(req,res,next){  
      var query = conn.query(`select DISTINCT tbl_nhatro.idNhatro, Title, Tenchutro,Sdt,Diachi,idQuan,
      idThanhpho,LocalX,LocalY,date_format(Date,"%Y-%m-%d") as date,Dientich,Phong,Nhavesinh,Mota,
      Gia,Maylanh,Giuxe,Nuocnong,Dien,Nuoc,Loainha,img,wifi,gio,chungchu,round(danhgia.vote,1) as Vote
      from quanlynhatro01.tbl_nhatro, quanlynhatro01.tbl_chitietnt,
      (SELECT idNhatro as id,Hinhanh as Img FROM quanlynhatro01.tbl_hinhanh group by idNhatro) as image,
      (SELECT idNhatro,avg(Vote) as vote FROM quanlynhatro01.tbl_danhgia group by idNhatro) as danhgia, 
      quanlynhatro01.tbl_danhgia, quanlynhatro01.tbl_qlnhatro
      where tbl_nhatro.idNhatro=tbl_chitietnt.idNhatro
      and tbl_nhatro.idNhatro=image.id and tbl_nhatro.idNhatro=danhgia.idNhatro and 
      tbl_qlnhatro.idNhatro=tbl_nhatro.idNhatro and tbl_qlnhatro.idUser= ${req.params.id} and Sate=1
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
              res.status(200).json(rows);
          }
        }); 
}

function EditNhaTro(req, res,next){
  if(req.headers && req.headers.authorization && String(req.headers.authorization.split(' ')[0]).toLowerCase()=== 'bearer'){
    var token =req.headers.authorization.split(' ')[1];
    if(token!=null){
      jwt.verify(token,'abc',function(err,decode){
        var query = conn.query(`UPDATE quanlynhatro01.tbl_nhatro SET Tenchutro = '${req.body.Tenchutro}', Sdt = '${req.body.Sdt}',
        Diachi = '${req.body.DiaChi}', idQuan = ${req.body.idQuan} , idThanhpho = 1,LocalX = ${req.body.LocalX}, LocalY = ${req.body.LocalY},
        Date = '${req.body.Date}', Title = '${req.body.Title}' WHERE (idNhatro = ${req.params.idnhatro});`, function (err, rows) {
                if (err) {
                  res.status(201).json({data:'error'});
                } else {
                  res.status(200).json({data:'Thành Công'});
                }
              }); 
      });
    }
    else{
      res.status(201).json({data:'Error'});
    }
  }else{
    res.status(201).json({data:'Error'});
  } 
}

function GetUser(req, res,next){
  if(req.headers && req.headers.authorization && String(req.headers.authorization.split(' ')[0]).toLowerCase()=== 'bearer'){
    var token =req.headers.authorization.split(' ')[1];
    if(token!=null){
      jwt.verify(token,'abc',function(err,decode){
        var query = conn.query(`SELECT idUser, Ho, Ten, date_format(Ngaysinh,"%Y-%m-%d") as NgaySinh, Diachi, Quan as idQuan, Thanhpho as idThanhpho, Sdt, photo
        FROM quanlynhatro01.tbl_userinfor
        WHERE tbl_userinfor.idUser=${req.params.id};`, function (err, rows) {
                if (err) {
                  res.status(201).json({data:'Error'});
                } else {
                  res.status(200).json(rows[0]);
                }
              }); 
      });
    }
    else{
      res.status(201).json({data:'Error'});
    }
  }else{
    res.status(201).json({data:'Error'});
  } 
}

function EditUser(req, res,next){
  if(req.headers && req.headers.authorization && String(req.headers.authorization.split(' ')[0]).toLowerCase()=== 'bearer'){
    var token =req.headers.authorization.split(' ')[1];
    if(token!=null){
      jwt.verify(token,'abc',function(err,decode){
        var query = conn.query(`UPDATE quanlynhatro01.tbl_userinfor SET Ho = '${req.body.Ho}', 
        Ten = '${req.body.Ten}', Ngaysinh = '${req.body.NgaySinh}', 
        Diachi = '${req.body.DiaChi}',  Quan = ${req.body.idQuan} , Thanhpho = 1,Sdt = '${req.body.Sdt}'
        WHERE (idUser = ${req.params.id});`, function (err, rows) {
                if (err) {
                  res.status(201).json({data:'error'});
                } else {
                  res.status(200).json({data:'Thành Công'});
                }
              }); 
      });
    }
    else{
      res.status(201).json({data:'Error'});
    }
  }else{
    res.status(201).json({data:'Error'});
  }
}

function InsertVote(req, res,next){
    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_danhgia(idNguoidung,idNhatro,Vote)
    values('${req.body.Userid}','${req.params.apartment_id}','${req.body.Vote}');`, function(err,rows){
      if(err){
        res.status(201).json({data:'Error'});
      }
      else{
        res.status(201).json({data:'thành công'});
      }
  });
}

function InsertComment(req, res,next){
    var query=conn.query(`INSERT INTO quanlynhatro01.tbl_binhluan(Noidung,date)
    values('${req.body.content}','${req.body.date}');`, function(err,rows){
      if(err){
        res.status(201).json({data:'Error'});
      }
      else{
            var query=conn.query(`SELECT max(idBinhluan) as id
            FROM quanlynhatro01.tbl_binhluan;`, function(err,rows){
            if(err){
              res.status(201).json({data:'Error'});
            }
            else{
                var idBinhluan=rows[0].id
                var query=conn.query(`INSERT INTO quanlynhatro01.tbl_bl_nguoidung(idBinhluan,idNguoidung)
                values('${idBinhluan}','${req.body.Userid}');`, function(err,rows){
                  if(err){
                    res.status(201).json({data:'Error'});
                  }
              });
                var query=conn.query(`INSERT INTO quanlynhatro01.tbl_bl_nhatro(idBinhluan,idNhatro)
                values('${idBinhluan}','${req.params.apartment_id}');`, function(err,rows){
                  if(err){
                    res.status(201).json({data:'Error'});
                  }
                  else{
                    res.status(201).json({data:'Thành công'});
                  }
              });
            }
        });
      }
  });
}

function UpdateNhaTro(req, res,next){
  var query=conn.query(`UPDATE quanlynhatro01.tbl_nhatro SET Tenchutro = '${req.body.Tenchutro}',Sdt = '${req.body.Sdt}',
  Diachi = '${req.body.Diachi}',idQuan = ${req.body.idQuan} , idThanhpho = 1,LocalX = ${req.body.LocalX},
  LocalY = ${req.body.LocalY},Date = '${req.body.date}',Title = '${req.body.Title}'
  WHERE (idNhatro = ${req.params.apartment_id});`, function(err,rows){
    if(err){
      console.log(1)
      res.status(201).json({data:'Error'});
    }
    else{
          var query=conn.query(`UPDATE quanlynhatro01.tbl_chitietnt SET Dientich = ${req.body.Dientich},Phong = ${req.body.Phong},
          Nhavesinh = ${req.body.Nhavesinh},Mota = '${req.body.Mota}', Gia = ${req.body.Gia},Maylanh = ${req.body.Maylanh},
          Giuxe = ${req.body.Giuxe},Nuocnong = ${req.body.Nuocnong},Dien = ${req.body.Dien},Nuoc = ${req.body.Nuoc},
          Loainha = '${req.body.Loainha}', wifi = ${req.body.wifi},gio = ${req.body.gio},chungchu = ${req.body.chungchu}
          WHERE (idNhatro = ${req.params.apartment_id});`, function(err,rows){
          if(err){
            console.log(2)
            res.status(201).json({data:'Error'});
          }
          else{
            res.status(201).json({data:'Thành công'});
          }
      });
    }
});
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function SendSMS(req, res,next){
  var sms = makeid();
  var query = conn.query(`SELECT * FROM quanlynhatro01.tbl_userinfor
  WHERE tbl_userinfor.idUser=${req.params.idUser};`, function (err, rows) {
    if (err) {
      res.status(201).json({data:'Error'});
    } else {
      const from = 'Vonage APIs';
      var tam = rows[0].Sdt;
      const to = tam.toString();
      const text = sms;
      nexmo.message.sendSms(from, to, text);
      console.log(to);
      res.status(201).json({data:sms});
    }
  }); 
}

function QuenMK(req, res,next){
    var query=conn.query(`UPDATE quanlynhatro01.tbl_user SET Password = "${req.body.pass}"
    WHERE idUser = ${req.params.idUser} ;`, function(err,rows){
      if(err){
        return res.status(201).json({data:'error'});
      }else{
        return res.status(200).json({data:'Dang Ky Thanh Cong'});
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
    EditNhaTro:EditNhaTro,
    GetUser:GetUser,
    EditUser:EditUser,
    InsertVote:InsertVote,
    InsertComment:InsertComment,
    UpdateNhaTro:UpdateNhaTro,
    getpostidquan:getpostidquan,
    SendSMS:SendSMS,
    QuenMK:QuenMK   
}
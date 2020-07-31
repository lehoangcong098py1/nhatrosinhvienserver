'use strict';

module.exports = function(app) {

    let NhaTro = require('./controller/NhaTro');

    app.route('/apartments')
        .get(NhaTro.getAllpost);

     app.route('/apartments/:Userid/user')    
        .post(NhaTro.DangTro);

    app.route('/uploadfile')
        .post(NhaTro.Uploadfile);

    app.route('/loadhinhanh')
        .get(NhaTro.loadhinhanh);
  
    app.route('/apartments/:id')
        .get(NhaTro.getpostid);
   
    app.route('/apartments/:id/comments')
        .get(NhaTro.Dsachcomment);
    
    app.route('/login')
        .post(NhaTro.Login);

    app.route('/logingoogle')
        .post(NhaTro.LoginGoogle);

    app.route('/user/:id/account')
        .post(NhaTro.DoiMK);
    
    app.route('/register')
        .post(NhaTro.DangKy);

    app.route('/loadhinhanhnhatro')
        .get(NhaTro.loadhinhanhnhatro);

    app.route('/search')
        .get(NhaTro.Search);   
    
    app.route('/filter')
        .post(NhaTro.Filter);
    
    app.route('/apartments/:id/user')
        .get(NhaTro.DSNhaTroUser);
    
    app.route('/apartments/:id/image')
        .get(NhaTro.ListImage);
    
    app.route('/User/:id')
        .get(NhaTro.GetUser)
        .post(NhaTro.EditUser);
    
    app.route('/apartments/:apartment_id/rating')
        .post(NhaTro.InsertVote);
    
    app.route('/apartments/:apartment_id/comments')
        .post(NhaTro.InsertComment);
    
    app.route('/apartments/:apartment_id')
        .post(NhaTro.UpdateNhaTro);

    app.route('/apartments/:idQuan/recommend')
        .get(NhaTro.getpostidquan);

    app.route('/User/:idUser/QuenMK')
        .get(NhaTro.SendSMS)
        .post(NhaTro.QuenMK);
};
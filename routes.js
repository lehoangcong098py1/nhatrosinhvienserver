'use strict';

module.exports = function(app) {

    let NhaTro = require('./controller/NhaTro');

    app.route('/apartments')
        .get(NhaTro.getAllpost);

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
    
    app.route('/apartments')
        .post(NhaTro.DangTro);

    app.route('/loadhinhanhnhatro')
        .get(NhaTro.loadhinhanhnhatro);
    
    app.route('/logingoogle')
        .post(NhaTro.LoginGoogle);

    app.route('/search')
        .get(NhaTro.Search);   
    
    app.route('/filter')
        .post(NhaTro.Filter);
    
    app.route('/apartments/:id/user')
        .get(NhaTro.DSNhaTroUser);
    
    app.route('/apartments/:id/image')
        .get(NhaTro.ListImage);
    
    app.route('/apartments/:idnhatro')
        .post(NhaTro.EditNhaTro);
};
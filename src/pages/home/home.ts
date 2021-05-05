// this file contains the general interface and basic mechanics of the application

import { Component, ViewChild, ElementRef } from "@angular/core";
import { Slides, Content, AlertController } from 'ionic-angular';
import { NavController, NavParams } from "ionic-angular";
import { Network } from '@ionic-native/network';
import { EmailComposer } from "@ionic-native/email-composer";
import { Platform } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { PopoverController } from 'ionic-angular';
import { PopoverItems } from './popover_menu';
import { PopoverImg } from './popover_img';
import { HttpClient } from '@angular/common/http';
import { DataShareProvider } from '../../providers/data-share/data-share';
import { CitProvider } from '../../providers/cit/cit';
import { TranslationProvider } from '../../providers/translations/translations';
import { DomSanitizer } from '@angular/platform-browser';
import { Clipboard } from '@ionic-native/clipboard/';

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  // setting up the canvas for eventual image display (if any)
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Content) cntent_temp: Content;
  canv_temp: ElementRef;
  @ViewChild('thecanvas') set content(content: ElementRef) {
    if (content !== undefined) {
      this.citP.canvas = content;
      this.citP.image_width = Math.floor(window.innerHeight * 0.62);
      this.citP.canvas.nativeElement.width = this.citP.image_width;
      this.citP.canvas.nativeElement.height = this.citP.image_width;
      this.citP.ctx = this.citP.canvas.nativeElement.getContext('2d');
    }
  }

  // /*
  // below is a mechanism for a custom interactive console for testing/debugging
  to_exec: any = 'this.';
  mycl: any;
  onChange(ee) {
    if (ee.keyCode === 13) {
      console.log(eval(this.to_exec));
      this.mycl = JSON.stringify(eval(this.to_exec));
    }
  }
  //*/

  // global variables
  initslide: any = 0;
  cit_items: string[] = [];
  form_items: FormGroup;
  mailpost: string = "";
  pwpost: string = "";
  email_valid: boolean = false;
  email_for_pw: string = "";
  consentset: any[] = [];
  img_dict: any = {};
  on_device: boolean;
  submit_failed: boolean = false;
  consentitems: string;
  // assign filler words in the given language
  targetref_words: string[] = JSON.parse(JSON.stringify(this.trP.targetref_words_orig[this.trP.lang]));
  nontargref_words: string[] = JSON.parse(JSON.stringify(this.trP.nontargref_words_orig[this.trP.lang]));

  constructor(
    public navCtrl: NavController,
    private emailComposer: EmailComposer,
    private clipboard: Clipboard,
    public platform: Platform,
    public formBuilder: FormBuilder,
    private network: Network,
    public popoverCtrl: PopoverController,
    public http: HttpClient,
    public dataShare: DataShareProvider,
    public citP: CitProvider,
    public trP: TranslationProvider,
    protected _sanitizer: DomSanitizer,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
    this.load_from_device();
    // validation of user inputs
    let validator_dict = {
      sub_id: [
        "",
        Validators.compose([Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9_]*"), Validators.required])
      ]
    }
    let input_names = ['target', 'probe1', 'probe2', 'probe3', 'probe4', 'probe5', 'filler1', 'filler2', 'filler3', 'filler4', 'filler5', 'filler6', 'filler7', 'filler8', 'filler9'];
    input_names.forEach(ky => validator_dict[ky] = [
      "",
      Validators.compose([
        Validators.maxLength(30),
        Validators.required
      ])
    ]);
    this.form_items = formBuilder.group(validator_dict);
    // get stored images (if any)
    this.dataShare.storage.get('imgs').then((cntent) => {
      if (cntent) {
        dataShare.stored_images = cntent;
      }
    });
    // get stored previous results (if any)
    this.dataShare.storage.get('reslts').then((cntent) => {
      if (cntent) {
        this.citP.stored_results = cntent;
      }
    });
    this.send_stat();
  }
  internet_on: boolean = false;
  checknet: any;
  ionViewDidLoad() {
    this.citP.content = this.cntent_temp;
    // basic settings (hiding bars etc) when platform loaded
    this.platform.ready().then(() => {
      this.on_device = this.platform.is("cordova");
      if (this.on_device) {
        this.checknet = setInterval(() => {
          if (this.network.type) {
            if (this.network.type != "none") {
              this.internet_on = true;
            } else {
              this.internet_on = false;
            }
          }
        }, 500);
        this.citP.statusBar.hide();
        this.citP.navigationBar.hideNavigationBar();
        this.citP.navigationBar.setUp(true);
        this.citP.backgroundMode.enable();
        this.citP.backgroundMode.setDefaults({
          title: "Concealed Information Test App active",
          text: "",
          silent: true
        });
        this.citP.path = this.citP.file.externalDataDirectory;
      }
    });
  }

  san_html(html) {
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  // arranges display of CIT results in the HTML
  dictitems = function(dict) {
    try {
      let ordered_vals = [];
      Object.keys(dict).sort().reverse().forEach((akey) => {
        ordered_vals.push({ 'k': akey, 'v': dict[akey] });
      });
      return ordered_vals;
    } catch {
      console.log("Failed to get dictionary values.");
      return []
    }
  }

  // tries to send basic statistics for each completed test to database
  send_single_stat = function(test_info, key_to_del) {
    this.http.post('https://homepage.univie.ac.at/gaspar.lukacs/x_citapp/x_citapp_stat.php',
      JSON.stringify({
        "testdate": test_info.slice(2),
        "testlang": test_info.slice(0, 2)
      }),
      { responseType: "text" }).subscribe((response) => {
        if (response == 'victory') {
          console.log('Saved to stats: ', key_to_del);
          this.dataShare.storage.remove(key_to_del);
        } else {
          console.log('Failed SQL:' + response);
        }
      },
        err => {
          console.log('Request failed: ', err);
        });
  }
  send_stat = function() {
    this.dataShare.storage.forEach((value, key) => {
      if (key.slice(0, 4) == 'test') {
        this.send_single_stat(value, key);
      }
    });
  }

  // store settings on device (on corresponding button click)
  store_on_device = async function() {
    await this.dataShare.storage.set('local', {
      'subject_id': this.citP.subj_id,
      'cit_version': this.citP.cit_type,
      'num_of_blocks': this.citP.num_of_blocks,
      'timelimit': this.citP.response_timelimit_main,
      'isi_min': this.citP.isi_delay_minmax[0],
      'isi_max': this.citP.isi_delay_minmax[1],
      'target': this.cit_items[0],
      'probe1': this.cit_items[1],
      'probe2': this.cit_items[2],
      'probe3': this.cit_items[3],
      'probe4': this.cit_items[4],
      'probe5': this.cit_items[5],
      'filler1': this.targetref_words[0],
      'filler2': this.targetref_words[1],
      'filler3': this.targetref_words[2],
      'filler4': this.nontargref_words[0],
      'filler5': this.nontargref_words[1],
      'filler6': this.nontargref_words[2],
      'filler7': this.nontargref_words[3],
      'filler8': this.nontargref_words[4],
      'filler9': this.nontargref_words[5],
      'img_dict': this.img_dict,
      'texttrans': this.texttrans,
      'save_on_citstart': this.save_on_citstart,
      'consent': this.consentset,
      'language': this.trP.lang,
      'mails': this.mails
    });
    try {
      let el = document.getElementById("storefeed_id2")
      el.style.color = 'green';
      setTimeout(() => {
        el.style.color = 'white';
      }, 2000);
    } catch { }
  }

  // load settings from device (on corresponding button click)
  load_from_device = function() {
    try {
      this.dataShare.storage.get('local').then((cntent) => {
        let data_dict = cntent;
        try {
          this.citP.subj_id = data_dict.subject_id;
          this.citP.cit_type = data_dict.cit_version;
          this.citP.num_of_blocks = data_dict.num_of_blocks;
          this.citP.response_timelimit_main = data_dict.timelimit;
          this.citP.isi_delay_minmax[0] = data_dict.isi_min;
          this.citP.isi_delay_minmax[1] = data_dict.isi_max;
          this.cit_items[0] = data_dict.target;
          this.cit_items[1] = data_dict.probe1;
          this.cit_items[2] = data_dict.probe2;
          this.cit_items[3] = data_dict.probe3;
          this.cit_items[4] = data_dict.probe4;
          this.cit_items[5] = data_dict.probe5;
          this.targetref_words[0] = data_dict.filler1;
          this.targetref_words[1] = data_dict.filler2;
          this.targetref_words[2] = data_dict.filler3;
          this.nontargref_words[0] = data_dict.filler4;
          this.nontargref_words[1] = data_dict.filler5;
          this.nontargref_words[2] = data_dict.filler6;
          this.nontargref_words[3] = data_dict.filler7;
          this.nontargref_words[4] = data_dict.filler8;
          this.nontargref_words[5] = data_dict.filler9;
          this.img_dict = data_dict.img_dict;
          this.show_imgs();
          this.texttrans = data_dict.texttrans;
          this.save_on_citstart = data_dict.save_on_citstart;
          this.consentset = data_dict.consent;
          this.trP.lang = data_dict.language,
            this.mails = data_dict.mails;
          this.change_texttrans();
        } catch (e) {
          console.log('(No locally saved data.)');
        }
      });
    } catch (e) {
      console.log('(No locally saved data.)');
    }
  }


  // display image thumbnails (of loaded images)
  show_imgs() {
    if (document.getElementById('filler9') != null) {
      if (Object.keys(this.img_dict).length !== 0) {
        Object.keys(this.img_dict).map((dkey) => {
          if (!dkey.includes('_img')) {
            this.display_thumbnail(dkey)
          }
        });
      }
    } else {
      setTimeout(() => {
        this.show_imgs()
      }, 500);
    }
  }


  // store settings in online database (on corresponding button click)
  settings_storage = function(datapost) {
    console.log('settings_storage starts...');
    if (datapost == 'yes') {
      datapost = JSON.stringify({
        'subject_id': this.citP.subj_id,
        'cit_version': this.citP.cit_type,
        'num_of_blocks': this.citP.num_of_blocks,
        'timelimit': this.citP.response_timelimit_main,
        'isi_min': this.citP.isi_delay_minmax[0],
        'isi_max': this.citP.isi_delay_minmax[1],
        'target': this.cit_items[0],
        'probe1': this.cit_items[1],
        'probe2': this.cit_items[2],
        'probe3': this.cit_items[3],
        'probe4': this.cit_items[4],
        'probe5': this.cit_items[5],
        'filler1': this.targetref_words[0],
        'filler2': this.targetref_words[1],
        'filler3': this.targetref_words[2],
        'filler4': this.nontargref_words[0],
        'filler5': this.nontargref_words[1],
        'filler6': this.nontargref_words[2],
        'filler7': this.nontargref_words[3],
        'filler8': this.nontargref_words[4],
        'filler9': this.nontargref_words[5]
      });
    }
    let themail;
    if (datapost == "sendpass") {
      themail = this.email_for_pw;
    } else {
      themail = this.mailpost;
      this.email_valid = false;
    }
    this.http.post('https://homepage.univie.ac.at/gaspar.lukacs/x_citapp/x_citapp_storage.php', JSON.stringify({
      email_post: themail,
      pw_post: this.pwpost,
      data_post: datapost
    }), { responseType: "text" }).subscribe((response) => {
      console.log(response);
      let feed;
      if (response.slice(0, 7) == 'victory') {
        document.getElementById("storefeed_id").style.color = 'green';
        response = response.slice(7)
        if (response.slice(0, 6) == 'insert') {
          response = response.slice(6)
          feed = "Data saved in database.";
        } else if (response.slice(0, 6) == 'update') {
          response = response.slice(6)
          feed = "Data updated in database.";
        } else if (response.slice(0, 6) == 'loaded') {
          response = response.slice(6)
          feed = this.load_settings(response);
        } else if (response.slice(0, 5) == 'Email') {
          feed = response;
          this.email_valid = false;
        }
      } else {
        if (response.slice(0, 6) == 'pwfail') {
          response = response.slice(6);
          if (/\S+@\S+\.\S+/.test(this.mailpost)) {
            this.email_valid = true;
            this.email_for_pw = themail;
          }
        }
        document.getElementById("storefeed_id").style.color = 'red';
        feed = 'Error. ' + response;
      }
      document.getElementById("storefeed_id").innerHTML = feed + "<br><br>";
    },
      err => {
        console.log('Request failed: ', err);
        document.getElementById("storefeed_id").style.color = 'red';
        let feed = 'Could not connect to server. ' + err.message;
        document.getElementById("storefeed_id").innerHTML = feed + "<br><br>";
      });
  }

  // validation check for English characters
  valid_chars(event: any) {
    const pattern = /[a-zA-Z0-9_]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  valid_chars2(event: any) {
    const pattern = /[a-zA-Z0-9_@.!]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  // validate email format
  mails: string = '';
  emails_input(event: any) {
    const pattern = /[a-zA-Z0-9\s;_@.!]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  // mails_sending: string = '';
  // checkmail() {
  //   let mailsarray = this.mails.split(";");
  //   this.mails_sending = '';
  //   mailsarray.map((ml) => {
  //     if (/\S+@\S+\.\S+/.test(ml)) {
  //       this.mails_sending = this.mails_sending + '; ' + ml.trim();
  //     }
  //   })
  //   this.mails_sending = this.mails_sending.substr(2)
  // }

  // send data via email (on corresponding button click)
  sendviaapp() {
    let email = {
      to: this.mails,
      cc: "",
      subject: "CITapp data " + this.citP.cit_results.file_name,
      body: "",
      attachments: [
        this.citP.path + this.citP.cit_results.file_name
      ]
    };
    this.emailComposer.open(email);
  }

  // copy data to clipboard (on corresponding button click)
  to_clipboard() {
    this.clipboard.copy(this.citP.cit_results.cit_data);
    try {
      document.getElementById("copyfeed_id").innerHTML = 'CIT result data copied to clipboard.';
      setTimeout(() => {
        document.getElementById("copyfeed_id").innerHTML = '&nbsp;';
      }, 3000);
    } catch { }
  }

  // auto-uppercase setting for stimulus display
  texttrans: boolean = true;
  change_texttrans() {
    if (this.texttrans === true) {
      document.documentElement.style.setProperty('--inputcase', 'uppercase');
    } else {
      document.documentElement.style.setProperty('--inputcase', 'none');
    }
  };

  // changing menus with popup
  seg_values: string[] = ['main', 'fillers', 'settings', 'autofill', 'start'];
  pop_menu(myEvent) {
    let popover = this.popoverCtrl.create(PopoverItems);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(pop_data => {
      if (pop_data != null) {
        this.goto_menu(pop_data);
      }
    })
  }

  // removing stored CIT results
  results_remove(to_del) {
    let delmsg;
    if (to_del == 'all') {
      delmsg = 'Are you sure you want to remove all CIT results?';
    } else {
      delmsg = 'Do you want to remove the CIT results with subject ID ' + this.citP.stored_results[to_del].subj_id + '?';
    }
    let alert = this.alertCtrl.create({
      title: 'Confirm removal',
      message: delmsg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: () => {
            if (to_del == 'all') {
              this.citP.stored_results = {};
              this.dataShare.storage.set('reslts', {});
            } else {
              delete this.citP.stored_results[to_del];
              this.dataShare.storage.set('reslts', this.citP.stored_results);
            }
          }
        }
      ]
    });
    alert.present();
  }

  // display previous CIT results
  show_res(res_id, menu) {
    this.citP.cit_results = this.citP.stored_results[res_id];
    this.citP.current_menu = menu;
    this.citP.current_segment = 'menus';
    this.citP.content.scrollToTop(0);
  }

  // menu switch
  goto_menu(menu_name) {
    this.citP.current_menu = menu_name;
    this.citP.current_segment = 'menus';
    this.citP.content.scrollToTop(0);
  }

  // image loading (via popover_img.ts)
  pop_imgs(myEvent, parent_id) {
    let popover = this.popoverCtrl.create(PopoverImg,
      {}, // nothing to pass
      { cssClass: 'popover_class' });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(selected_img => {
      if (selected_img != null) {
        this.add_img(parent_id, selected_img);
      }
    });
  }

  // add chosen image as given item
  add_img(img_key, filename) {
    this.img_dict[img_key] = filename;
    this.image_names();
    this.img_dict[img_key + '_img'] = this.dataShare.stored_images[filename];
    this.display_thumbnail(img_key);
  }

  // display specific image as thumbnail
  display_thumbnail(img_key) {
    let img = new Image;
    img.style.height = "9vw";
    img.id = img_key + '_img';
    img.src = this.img_dict[img.id];
    try {
      let img_elem = document.getElementById(img.id);
      img_elem.parentNode.removeChild(img_elem);
    } catch { }
    let element = document.getElementById(img_key);
    element.appendChild(img);
  }

  // add remove specific image
  remove_img_el(parent_id) {
    if (this.img_dict[parent_id] !== undefined) {
      this.img_dict[parent_id] = '';
      this.image_names();
      let img_elem: HTMLImageElement = document.querySelector('#' + parent_id + '_img');
      img_elem.src = '';
      img_elem.parentNode.removeChild(img_elem);
      delete this.img_dict[parent_id];
      delete this.img_dict[parent_id + '_img'];
    }
  }

  // (re)set image names after adding/removing
  image_names() {
    this.cit_items[0] = (this.img_dict.target === undefined) ? this.cit_items[0] : this.img_dict.target;
    this.cit_items[1] = (this.img_dict.probe1 === undefined) ? this.cit_items[1] : this.img_dict.probe1;
    this.cit_items[2] = (this.img_dict.probe2 === undefined) ? this.cit_items[2] : this.img_dict.probe2;
    this.cit_items[3] = (this.img_dict.probe3 === undefined) ? this.cit_items[3] : this.img_dict.probe3;
    this.cit_items[4] = (this.img_dict.probe4 === undefined) ? this.cit_items[4] : this.img_dict.probe4;
    this.cit_items[5] = (this.img_dict.probe5 === undefined) ? this.cit_items[5] : this.img_dict.probe5;
    this.targetref_words[0] = (this.img_dict.filler1 === undefined) ? this.targetref_words[0] : this.img_dict.filler1;
    this.targetref_words[1] = (this.img_dict.filler2 === undefined) ? this.targetref_words[1] : this.img_dict.filler2;
    this.targetref_words[2] = (this.img_dict.filler3 === undefined) ? this.targetref_words[2] : this.img_dict.filler3;
    this.nontargref_words[0] = (this.img_dict.filler4 === undefined) ? this.nontargref_words[0] : this.img_dict.filler4;
    this.nontargref_words[1] = (this.img_dict.filler5 === undefined) ? this.nontargref_words[1] : this.img_dict.filler5;
    this.nontargref_words[2] = (this.img_dict.filler6 === undefined) ? this.nontargref_words[2] : this.img_dict.filler6;
    this.nontargref_words[3] = (this.img_dict.filler7 === undefined) ? this.nontargref_words[3] : this.img_dict.filler7;
    this.nontargref_words[4] = (this.img_dict.filler8 === undefined) ? this.nontargref_words[4] : this.img_dict.filler8;
    this.nontargref_words[5] = (this.img_dict.filler9 === undefined) ? this.nontargref_words[5] : this.img_dict.filler9;
  }


  // load settings from online database (on corresponding button click)
  load_settings(loaded_data) {
    try {
      let data_dict = JSON.parse(loaded_data);
      this.citP.subj_id = data_dict.subject_id || this.citP.subj_id;
      this.citP.cit_type = data_dict.cit_version || this.citP.cit_type;
      this.citP.num_of_blocks = data_dict.num_of_blocks || this.citP.num_of_blocks;
      this.citP.response_timelimit_main = data_dict.timelimit || this.citP.response_timelimit_main;
      this.citP.isi_delay_minmax[0] = data_dict.isi_min || this.citP.isi_delay_minmax[0];
      this.citP.isi_delay_minmax[1] = data_dict.isi_max || this.citP.isi_delay_minmax[1];
      this.cit_items[0] = data_dict.target || this.cit_items[0];
      this.cit_items[1] = data_dict.probe1 || this.cit_items[1];
      this.cit_items[2] = data_dict.probe2 || this.cit_items[2];
      this.cit_items[3] = data_dict.probe3 || this.cit_items[3];
      this.cit_items[4] = data_dict.probe4 || this.cit_items[4];
      this.cit_items[5] = data_dict.probe5 || this.cit_items[5];
      this.targetref_words[0] = data_dict.filler1 || this.targetref_words[0];
      this.targetref_words[1] = data_dict.filler2 || this.targetref_words[1];
      this.targetref_words[2] = data_dict.filler3 || this.targetref_words[2];
      this.nontargref_words[0] = data_dict.filler4 || this.nontargref_words[0];
      this.nontargref_words[1] = data_dict.filler5 || this.nontargref_words[1];
      this.nontargref_words[2] = data_dict.filler6 || this.nontargref_words[2];
      this.nontargref_words[3] = data_dict.filler7 || this.nontargref_words[3];
      this.nontargref_words[4] = data_dict.filler8 || this.nontargref_words[4];
      this.nontargref_words[5] = data_dict.filler9 || this.nontargref_words[5];
      this.consentset = data_dict.consent || this.consentset;
      this.trP.lang = data_dict.language || this.trP.lang;
      this.mails = data_dict.mails || this.mails;
      return ("Data loaded from database");
    } catch (e) {
      document.getElementById("storefeed_id").style.color = 'red';
      return ("Error: stored data is not in proper (JSON) format.");
    }
  };

  // on start-click, begin CIT using all given settings
  save_on_citstart: boolean = true;
  duplicates: string = '';
  initials() {
    let allitems = JSON.parse(JSON.stringify(this.cit_items.concat(this.targetref_words, this.nontargref_words)));
    allitems = allitems.filter(item => item !== null);
    let dupls = allitems.reduce((acc, v, i, arr) => arr.indexOf(v) !== i && acc.indexOf(v) === -1 ? acc.concat(v) : acc, [])
    dupls = dupls.filter(item => item !== '');
    if (dupls.length > 0) {
      this.duplicates = '"' + dupls.join('", "') + '"';
    } else {
      this.duplicates = '';
      if (!this.form_items.valid) {
        this.submit_failed = true;
        // for TESTING:
        // console.log('testing');
        // this.auto_img();
        // this.fill_demo();
      } else {
        clearInterval(this.checknet);
        if (this.texttrans === true) {
          this.cit_items = this.cit_items.map(w => w.toUpperCase())
          this.targetref_words = this.targetref_words.map(w => w.toUpperCase())
          this.nontargref_words = this.nontargref_words.map(w => w.toUpperCase())
        }
        if (this.save_on_citstart === true) {
          this.store_on_device();
        }
        this.citP.cit_type = parseInt(this.citP.cit_type);
        this.citP.num_of_blocks = parseInt(this.citP.num_of_blocks);

        if (this.consentset.indexOf('1') !== -1 || this.consentset.indexOf('2') !== -1) {
          this.consentitems = '';
          if (this.consentset.indexOf('1') !== -1 && this.consentset.indexOf('2') !== -1) {
            this.consentitems = this.trP.consentitems_chosen[this.trP.lang];
          } else if (this.consentset.indexOf('2') !== -1) {
            this.consentitems = this.trP.consentitems_conf[this.trP.lang];;
          }
          this.citP.switch_divs('div_consent')
        } else {
          this.init_cit(99);
        }
      }
    }
  }

  // initiate data and create basic items
  init_cit(chosen) {
    this.citP.consented = chosen;
    this.citP.cit_data =
      ["subject_id", "cit_version", "phase", "block_number", "trial_number", "stimulus_shown", "category", "stim_type", "response_key", "rt_start", "rt_duration", "incorrect", "too_slow", "isi", "date_in_ms"].join('\t') + "\n";
    this.create_stim_base();
    this.to_img();
  }

  // set images (if any), then prepare block texts and start CIT (see cit.js)
  async to_img() {
    await Promise.all(this.citP.stim_base.map(async (dict) => {
      if (dict['imgurl'] !== null) {
        this.citP.task_images[dict['item']] = await this.imgurl(dict['imgurl']);
      }
      delete dict['imgurl'];
    }));
    await Promise.all(this.citP.targetrefs.map(async (dict) => {
      if (dict['imgurl'] !== null) {
        this.citP.task_images[dict['item']] = await this.imgurl(dict['imgurl']);
      }
      delete dict['imgurl'];
    }));
    await Promise.all(this.citP.nontargrefs.map(async (dict) => {
      if (dict['imgurl'] !== null) {
        this.citP.task_images[dict['item']] = await this.imgurl(dict['imgurl']);
      }
      delete dict['imgurl'];
    }));
    this.citP.set_block_texts();
    this.citP.task_start();
    this.citP.nextblock();
  }

  // load image from source URL
  imgurl(base64) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.src = base64;
    })
  }

  // set default items/settings (on corresponding clicks)
  default_fillers() {
    Object.keys(this.img_dict).map((key) => {
      if (key.slice(0, 6) === 'filler') {
        this.remove_img_el(key);
      }
    });
    this.targetref_words = JSON.parse(JSON.stringify(this.trP.targetref_words_orig[this.trP.lang]));
    this.nontargref_words = JSON.parse(JSON.stringify(this.trP.nontargref_words_orig[this.trP.lang]));
  }
  default_core() {
    Object.keys(this.img_dict).map((key) => {
      if (key.slice(0, 6) === 'target' || key.slice(0, 5) === 'probe') {
        this.remove_img_el(key);
      }
    });
    this.cit_items.map((x, i) => this.cit_items[i] = '');
    this.citP.subj_id = '';
  }
  default_settings() {
    this.texttrans = true;
    this.citP.cit_type = 0;
    this.citP.num_of_blocks = 1;
    this.citP.isi_delay_minmax = [300, 700];
    this.citP.response_timelimit_main = 900;
    this.trP.lang = 'en';
    this.mails = '';
  }
  fill_demo = function() {
    this.default_core();
    this.citP.subj_id = 'CIT_demo_suspect_01';
    this.cit_items[0] = 'AUG 25';
    this.cit_items[1] = 'FEB 12';
    this.cit_items[2] = 'MAY 09';
    this.cit_items[3] = 'JUN 14';
    this.cit_items[4] = 'OCT 23';
    this.cit_items[5] = 'DEC 05';
    document.getElementById("demofeed_id").style.color = 'green';
    setTimeout(() => {
      try {
        document.getElementById("demofeed_id").style.color = 'white';
      } catch { };
    }, 2000);
  }

  // autofill images (on corresponding click)
  auto_img() {
    let feed;
    let added = [];
    document.getElementById("imgfeed_id").style.color = 'red';
    if (Object.keys(this.dataShare.stored_images).length === 0) {
      feed = 'No images are loaded.'
    } else {
      let all_ids = ['target', 'probe1', 'probe2', 'probe3', 'probe4', 'probe5', 'filler1', 'filler2', 'filler3', 'filler4', 'filler5', 'filler6', 'filler7', 'filler8', 'filler9'];
      Object.keys(this.dataShare.stored_images).map((filename) => {
        all_ids.map((img_id) => {
          if (filename.includes(img_id)) {
            this.add_img(img_id, filename)
            added.push(filename);
          }
        });
      });
      if (added.length === 0) {
        feed = 'No image names match the item names.'
      } else {
        document.getElementById("imgfeed_id").style.color = 'green';
        feed = 'Images added. (' + added.length + ' images: ' + added.join(', ') + '.)';
      }
    }
    try {
      document.getElementById("imgfeed_id").innerHTML = feed;
      setTimeout(() => {
        document.getElementById("imgfeed_id").innerHTML = '';
      }, 3000);
    } catch { }
  }

  // creating basic items (probes, fillers)
  create_stim_base() {
    this.citP.blocknum = 1;
    this.citP.stim_base = [];
    this.citP.the_targets = [];
    this.citP.the_nontargs = [];
    this.citP.the_probes = [];
    this.citP.targetrefs = [];
    this.citP.nontargrefs = [];
    this.citP.task_images = {};
    this.citP.all_rts = {
      "probe1": [],
      "probe2": [],
      "probe3": [],
      "probe4": [],
      "probe5": [],
      "targetflr": [],
      "nontargflr": [],
      "target": []
    };

    // get probes ("CIT items") and create basic their set of trials
    var items_array = JSON.parse(JSON.stringify(this.cit_items));
    items_array.forEach((item, num) => {
      let tempdict: any = {
        'item': item,
        'cat': 'main'
      }
      if (0 === num) {
        tempdict.type = "target";
        if (Object.keys(this.img_dict).indexOf('target') !== -1) {
          tempdict.mode = 'image';
          tempdict.imgurl = this.img_dict['target_img'];
        } else {
          tempdict.mode = 'text';
          tempdict.imgurl = null;
        }
        this.citP.the_targets.push(tempdict);
      } else {
        tempdict.type = "probe" + num;
        if (Object.keys(this.img_dict).indexOf('probe' + num) !== -1) {
          tempdict.mode = 'image';
          tempdict.imgurl = this.img_dict["probe" + num + '_img'];
        } else {
          tempdict.mode = 'text';
          tempdict.imgurl = null;
        }
        this.citP.the_nontargs.push(tempdict);
      }
      if (!(this.citP.cit_type === 2 && tempdict.type === "target")) {
        this.citP.stim_base.push(tempdict);
      }
    });

    // create basic set of targetside trials
    this.targetref_words.forEach((ref_item, num) => {
      let tempdict: any = {
        'item': ref_item,
        'type': 'targetflr' + num,
        'cat': 'filler'
      }
      if (Object.keys(this.img_dict).indexOf('filler' + (num + 1)) !== -1) {
        tempdict.mode = 'image';
        tempdict.imgurl = this.img_dict["filler" + (num + 1) + '_img'];
      } else {
        tempdict.mode = 'text';
        tempdict.imgurl = null;
      }
      this.citP.targetrefs.push(tempdict);
    });

    // create basic set of nontargetside trials
    this.nontargref_words.forEach((ref_item, num) => {
      let tempdict: any = {
        'item': ref_item,
        'type': 'nontargflr' + num,
        'cat': 'filler'
      }
      if (Object.keys(this.img_dict).indexOf('filler' + (num + 4)) !== -1) {
        tempdict.mode = 'image';
        tempdict.imgurl = this.img_dict["filler" + (num + 4) + '_img'];
      } else {
        tempdict.mode = 'text';
        tempdict.imgurl = null;
      }
      this.citP.nontargrefs.push(tempdict);
    });
  }

  // go to settings slide clicked on opening screen
  goto_slide(snum) {
    if (this.citP.current_menu === '') {
      this.slides.slideTo(snum);
    } else {
      this.initslide = snum;
      this.citP.current_menu = '';
    }
    this.citP.content.scrollToTop(0);
  }

  // switch back to settings screen after CIT
  sethome() {
    this.citP.switch_divs('div_settings');
    this.citP.current_menu = 'm_testres';
    this.citP.current_segment = 'menus';
    this.send_stat();
  }
}

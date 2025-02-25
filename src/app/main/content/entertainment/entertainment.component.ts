import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CONSTANTS } from '../../common/constants';
import { GlobalFunctions } from '../../common/global-functions';
import { ModalService } from '../../_modal';
import { EntertainmentService } from './entertainment.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-entertainment',
  templateUrl: './entertainment.component.html',
  styleUrls: ['./entertainment.component.scss']
})
export class EntertainmentComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: any;

  constants = CONSTANTS;
  allEntertainmentPhotosAndVideosList: any = [];
  entertainmentArrObj: any = {};
  myPostsObj: any = [];
  isLoading: boolean = false;

  currentPage: number = 1;
  pageSize: number = 20;
  hasMoreRecords: boolean = true;

  all: boolean = true;
  images: boolean = false;
  videos: boolean = false;
  myPosts: boolean = false;
  commentPop: boolean = false;
  commentsArr: any = [];
  tmpPopObj: any;

  tmpEObj: any;
  selectedEmoji: any;


  showEmojiPicker: boolean = false;

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    let message = '';
    if (this.commentInput.nativeElement.value && this.commentInput.nativeElement.value != '') {
      message = this._globalFunctions.copyObject(this.commentInput.nativeElement.value);
    }
    const text = `${message}${event.emoji.native}`;    
    this.commentInput.nativeElement.value = text;
    // this.showEmojiPicker = false;
  }

  onFocus() {
    this.showEmojiPicker = false;
  }
  onBlur() {
    this.showEmojiPicker = false;
  }

  @ViewChild('commentInput') commentInput: any;

  constructor(
    public _globalFunctions: GlobalFunctions,
    private _entertainment: EntertainmentService,
    private _modalService: ModalService,
    private _router: Router,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {
    //this.getEntertainment();
    this.loadMoreEntertainmentItems();
  }

  // getEntertainment(): void {
  //   this.isLoading = true;
  //   this._entertainment.getEntertainmentApi().subscribe((result: any) => {
  //     if (result && result.IsSuccess) {
  //       this.allEntertainmentPhotosAndVideosList = this._globalFunctions.copyObject(result?.Data || []);
  //       this.entertainmentArrObj = _.mapValues(_.groupBy(this.allEntertainmentPhotosAndVideosList, 'media'));
  //       this.isLoading = false;
  //     } else {
  //       this._globalFunctions.successErrorHandling(result, this, true);
  //       this.isLoading = false;
  //     }
  //   }, (error: any) => {
  //     this._globalFunctions.errorHanding(error, this, true);
  //     this.isLoading = false;
  //   });
  // }
  loadMoreEntertainmentItems() {
    if (!this.isLoading) {
      this.isLoading = true;
      let data = {page: this.currentPage, limit: this.pageSize};
      this._entertainment.getEntertainmentApi(data).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          //this.allEntertainmentPhotosAndVideosList = this._globalFunctions.copyObject(result?.Data || []);
          //this.entertainmentArrObj = _.mapValues(_.groupBy(this.allEntertainmentPhotosAndVideosList, 'media'));
          if (result.Data.length === 0) {
            // No more records, set the flag to stop further API requests
            this.hasMoreRecords = false;
          } else {
            const newItems = this._globalFunctions.copyObject(result?.Data || []); // Adjust this based on your API response structure
            this.allEntertainmentPhotosAndVideosList = [...this.allEntertainmentPhotosAndVideosList, ...newItems];
            this.isLoading = false;
            this.currentPage++;
          }
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
  }
  onScroll() {
    console.log("scrolled!!");
    this.loadMoreEntertainmentItems();
  }
  commentBox(event: any): void {
    const itemEV: any = {
      entertainment_id: event?._id || event?.entertainment_id,
      entertainment_url: event?.url || event?.entertainment_url
    }
    this.isLoading = true;
    this._entertainment.getAllComments(itemEV).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        this.commentsArr = result?.Data;
        this.isLoading = false;
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
    this.tmpPopObj = event;
    this.commentPop = true;
  }

  sendComment(comment: any = ''): void {
    if (comment && comment != '' && comment.trim() != '') {
      this.isLoading = true;
      const itemEV: any = {
        entertainment_id: this.tmpPopObj?._id,
        entertainment_url: this.tmpPopObj?.url,
        comment: comment.trim()
      }

      this._entertainment.comment(itemEV).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.commentsArr.push(result?.Data);
          this.commentInput.nativeElement.value = "";
          this.isLoading = false;
          setTimeout(() => {
            this.scrollToBottom();
          }, 0);
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isLoading = false;
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
      });
    }
  }

  closeCommentBox(): void {
    this.tmpPopObj = '';
    this.commentPop = false;
  }

  openPop(event: any, entertainment: any = {}): void {
    this._modalService.open("detailPop");
    this.tmpEObj = entertainment;
  }

  openUrl(event: any, entertainment: any = {}): void {
    this.tmpEObj = entertainment;
    switch (entertainment.type) {
      case 'event':
        this._router.navigate(['/events/' + entertainment?._id]);
        break;
      case 'offlineoffer':
        this._router.navigate(['/offline-shops/' + entertainment?._id]);
        break;
      case 'onlineoffer':
        this._router.navigate(['/online-offers/' + entertainment?._id]);
        break;
      case 'livestream':
        this._router.navigate(['/live-stream/' + entertainment?._id]);
        break;
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}

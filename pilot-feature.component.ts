import { Component, OnInit, ViewChild } from '@angular/core';
import { pilotFeature } from '../businessObjects/pilotFeature';
import { PilotFeatureService } from '../services/pilot-feature.service';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedPilotDialogComponent } from '../confirmationModals/unsaved-pilot-dialog/unsaved-pilot-dialog.component';
import { UpdatePilotDialogComponent } from '../confirmationModals/update-pilot-dialog/update-pilot-dialog.component';
import { StartPilotDialogComponent } from '../confirmationModals/start-pilot-dialog/start-pilot-dialog.component';
import { Message } from '../common/Message';
import { MessageType } from '../businessObjects/MessageType';
import { NotificationHelperService } from '../helperServices/notification.helperservices';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pilot-feature',
  templateUrl: './pilot-feature.component.html',
  styleUrls: ['./pilot-feature.component.scss']
})
export class PilotFeatureComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('allSelected') private allSelected: any;
  @ViewChild('allSelectedD') private allSelectedD: any;
  @ViewChild('allSelectedM') private allSelectedM: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  pilotForm: FormGroup;

  pilotDataSource: pilotFeature[] = [];
  pilotDataSourceSort: MatTableDataSource<pilotFeature> = new MatTableDataSource([]);
  displayedColumns = ['description', 'status', 'actions'];
  sortDirection = true;
  currentSortColumn = 'none';
  totalRecords;
  resultsLength: number = 10;
  currentPage = 0;
  showNewRow = [];
  showSaveSelection = [];
  disableSaveBtn = [];
  shops = [];
  shopsFilter = [];
  districtManager = [];
  districtManagerFilter = [];
  districts = [];
  districtsFilter = [];
  filteredShops = [];
  searchData = [];
  selectedAll: any;
  pilotCheck = [];
  selectedShopValue = [];
  selectedShop = [];
  selectedManager = [];
  selectedManagerValue = [];
  selectedDistrictValue = [];
  allShopData : boolean;
  allManagerData : boolean;
  allDistrictsData : boolean;
  showClearSelectionManager = [];
  showClearSelectionDistrict = [];
  showClearSelectionshop = [];
  public message = new Message();
  allValues: any = "*";
  selectedDistrict = [];
  shopLength: any;
  ddShopChecked: boolean = false;
  ddShopCheckedAll: boolean = false;
  ddManagerChecked: boolean = false;
  ddManagerCheckedAll: boolean = false;
  ddDistrictChecked: boolean = false;
  ddDistrictCheckedAll: boolean = false;

  constructor(private fb: FormBuilder, private pilotService: PilotFeatureService, public dialog: MatDialog, private notificationHelperService: NotificationHelperService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.pilotForm = this.formBuilder.group({
      shopName: [''],
      managerName: [''],
      districtsName: [''],
      selectedShopValue: [''],
      selectedManagerValue: [''],
      selectedDistrictValue: [''],
    })

    this.getPilotFeatures();
    this.getShops();
    this.getDistrictManager();
    this.getDistricts();
  }

  getPilotFeatures() {
    this.selectedShopValue = [];
    this.selectedManagerValue = [];
    this.selectedDistrictValue = [];
    this.pilotService.getPilotFeaturesData().subscribe(res => {
      res = res.sort((a: any, b: any) => a.description.localeCompare(b.description));
      this.pilotDataSource = res;
      res.forEach(row => {
        this.selectedShopValue.push(row.shopNumberList == this.allValues ? this.shops : row.shopNumberList);
        this.selectedManagerValue.push(row.employeeNumberList == this.allValues ? [...this.districtManager.map(res => res.employeeID)] : row.employeeNumberList);
        this.selectedDistrictValue.push(row.repairDistrictList == this.allValues ? [...this.districts.map(res => res.employeeID)] : row.repairDistrictList);
        // this.selectedShopValue.push(this.allShopData ? this.shops : row.shopNumberList);
        // this.selectedManagerValue.push(this.allManagerData ? [...this.districtManager.map(res => res.employeeID)] : row.employeeNumberList);
        // this.selectedDistrictValue.push(this.allDistrictsData ? [...this.districts.map(res => res.employeeID)] : row.repairDistrictList);
      })
      this.pilotDataSourceSort = new MatTableDataSource(res);
      this.pilotDataSourceSort.paginator = this.paginator;
      this.pilotDataSourceSort.sort = this.sort;
    })
  }

  showShopVal(i: number, check) {
    this.selectedShop = [];
    if (this.pilotForm.get('selectedShopValue').value) {
      this.selectedShopValue[i] = this.pilotForm.controls.selectedShopValue.value;
    }
    if (check == true) {
      this.ddShopChecked = true;
      this.ddShopCheckedAll = true;
      this.shops.forEach(res => {
        for (let j = 0; j < this.selectedShopValue[i].length; j++) {
          if (res == this.selectedShopValue[i][j]) {
            this.selectedShop.push(res);
          }
        }
      })

    } else {
      this.ddShopChecked = false;
      this.ddShopCheckedAll = false;
    }
    if (!this.showClearSelectionshop[i] && this.ddShopChecked) {
      this.selectedShop = [];
    }
  }

  showManagerVal(i: number, check) {
    this.selectedManager = [];
    if (this.pilotForm.get('selectedManagerValue').value) {
      this.selectedManagerValue[i] = this.pilotForm.controls.selectedManagerValue.value;
    }
    if (check == true) {
      this.ddManagerChecked = true;
      this.ddManagerCheckedAll = true;
      this.districtManager.forEach(res => {
        for (let j = 0; j < this.selectedManagerValue[i].length; j++) {
          if (res.employeeID == this.selectedManagerValue[i][j]) {
            this.selectedManager.push(res);
          }
        }
      })
    } else {
      this.ddManagerChecked = false;
      this.ddManagerCheckedAll = false;
    }
    if (!this.showClearSelectionManager[i] && this.ddManagerChecked) {
      this.selectedManager = [];
    }
  }

  showDictrictVal(i: number, check) {
    this.selectedDistrict = [];
    if (this.pilotForm.get('selectedDistrictValue').value) {
      this.selectedDistrictValue[i] = this.pilotForm.controls.selectedDistrictValue.value;
    }
    if (check == true) {
      this.ddDistrictChecked = true;
      this.ddDistrictCheckedAll = true;
      this.districts.forEach(res => {
        for (let j = 0; j < this.selectedDistrictValue[i].length; j++) {
          if (res.employeeID == this.selectedDistrictValue[i][j]) {
            this.selectedDistrict.push(res);
          }
        }
      })
    } else {
      this.ddDistrictChecked = false;
      this.ddDistrictCheckedAll = false;
    }
    if (!this.showClearSelectionDistrict[i] && this.ddDistrictChecked) {
      this.selectedDistrict = [];
    }
  }

  getShops() {
    this.pilotService.getShopsData().subscribe(res => {
      res = res.sort((a: any, b: any) => { return a - b });
      this.shops = res;
      this.shopsFilter = res;
    })
  }

  getDistrictManager() {
    this.pilotService.getDistrictManagerData().subscribe(res => {
      res = res.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.districtManager = this.removeDuplicates(res, x => x.employeeID);
      this.districtManagerFilter = this.districtManager;
    })
  }

  getDistricts() {
    this.pilotService.getDistrictData().subscribe(res => {
      res = res.sort((a: any, b: any) => a.districtTitle.localeCompare(b.districtTitle));
      this.districts = this.removeDuplicates(res, x => x.employeeID);
      this.districtsFilter = this.districts;
    })
  }

  removeDuplicates(data, key) {
    return [...new Map(data.map(x => [key(x), x])).values()]
  }

  toggleAllSelection(i:number) {
    this.shopSearchCleared();
    if (this.allSelected.selected) {
      this.pilotForm.controls.selectedShopValue.patchValue([...this.shops], 0);
      this.allSelected.select();
    } else {
      this.pilotForm.controls.selectedShopValue.patchValue([]);
      this.clearSelectionChanges(i);
    }
  }
  toggleAllSelectionM(i:number) {
    this.managerSearchCleared();
    if (this.allSelectedM.selected) {
      this.pilotForm.controls.selectedManagerValue.patchValue([...this.districtManager.map(res => res.employeeID)], 0);
      this.allSelectedM.select();
    } else {
      this.pilotForm.controls.selectedManagerValue.patchValue([]);
      this.clearSelectionChanges(i);
    }
  }
  toggleAllSelectionD(i:number) {
    this.districtSearchCleared();
    if (this.allSelectedD.selected) {
      this.pilotForm.controls.selectedDistrictValue.patchValue([...this.districts.map(res => res.employeeID)], 0);
      this.allSelectedD.select();
    } else {
      this.pilotForm.controls.selectedDistrictValue.patchValue([]);
      this.clearSelectionChanges(i);
    }
  }

  togglePerOne(all) {
    if (this.allSelected.selected) {
      this.allSelected.deselect();
      return false;
    }
    if (this.pilotForm.get('selectedShopValue').value.length == this.shops.length) {
      this.allSelected.select();
    }
  }

  togglePerOneM(all) {
    if (this.allSelectedM.selected) {
      this.allSelectedM.deselect();
      return false;
    }
    if (this.pilotForm.get('selectedManagerValue').value.length == this.districtManager.length) {
      this.allSelectedM.select();
    }
  }
  
  togglePerOneD(all) {
    if (this.allSelectedD.selected) {
      this.allSelectedD.deselect();
      return false;
    }
    if (this.pilotForm.get('selectedDistrictValue').value.length == this.districts.length) {
      this.allSelectedD.select();
    }
  }

  onStartPilotCheck(i: number, statusCheck: any): void {
    this.getSelectedDropdownValues(i);
    const payload: any = {
      id: this.pilotDataSource[i].id,
      status: statusCheck ? 'ACTIVE' : 'INACTIVE'
    }

    if (this.pilotDataSource[i].status == 'ACTIVE') {
      this.pilotService.updateStatusCheckData(payload).subscribe(res => {
        this.getPilotFeatures();
      })
    }

    if (this.pilotDataSource[i].status == 'INACTIVE') {
      // this.getSelectedDropdownValues(i);
      if ((this.pilotForm.get('selectedShopValue').value || this.pilotForm.get('selectedManagerValue').value || this.pilotForm.get('selectedDistrictValue').value) != null &&
        (this.pilotForm.get('selectedShopValue').value || this.pilotForm.get('selectedManagerValue').value || this.pilotForm.get('selectedDistrictValue').value) != "") {
        this.pilotService.updateStatusCheckData(payload).subscribe(res => {
          this.showNewRow[i] = false;
          this.showSaveSelection[i] = false;
          const messageData = {
            title: this.message.PILOTED_FEATURE_SUCCESSFULLY,
            type: MessageType.success
          };
          this.notificationHelperService.emitNotificationChangeEvent(messageData);
          this.getPilotFeatures();
        })
      } else {
        this.showNewRow[i] = true;
        this.showSaveSelection[i] = true;
        this.clearSelectionChanges(i);
        this.getPilotFeatures();
      }
    }
  }

  updateAndSavePilot(i: number): void {

    const payload: any = {
      id: this.pilotDataSource[i].id,
      name: this.pilotDataSource[i].name,
      description: this.pilotDataSource[i].description,
      status: this.pilotDataSource[i].status,
      shopNumberList: this.allShopData ? ['*'] : (this.pilotForm.get('selectedShopValue').value ? this.pilotForm.get('selectedShopValue').value : []),
      employeeNumberList: this.allManagerData ? ['*'] : (this.pilotForm.get('selectedManagerValue').value ? this.pilotForm.get('selectedManagerValue').value : []),
      repairDistrictList: this.allDistrictsData ? ['*'] : (this.pilotForm.get('selectedDistrictValue').value ? this.pilotForm.get('selectedDistrictValue').value : []),
    }

    if (this.pilotDataSource[i].status == 'INACTIVE') {

      const dialogRef = this.dialog.open(StartPilotDialogComponent);
      if (this.dialog.open) {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.allDropdownValues(i);
            if ((this.pilotForm.get('selectedShopValue').value || this.pilotForm.get('selectedManagerValue').value || this.pilotForm.get('selectedDistrictValue').value) != null &&
              (this.pilotForm.get('selectedShopValue').value || this.pilotForm.get('selectedManagerValue').value || this.pilotForm.get('selectedDistrictValue').value) != "") {
              this.pilotService.updateFeatureToggleData(payload).subscribe(res => {
                this.showNewRow[i] = false;
                this.showSaveSelection[i] = false;
                this.onStartPilotCheck(i, this.pilotDataSource[i].status);
              })
            } else {
              this.pilotService.updateFeatureToggleData(payload).subscribe(res => {
                this.showNewRow[i] = false;
                this.showSaveSelection[i] = false;
                this.getPilotFeatures();
              })
            }
          } else {
            this.pilotService.updateFeatureToggleData(payload).subscribe(res => {
              this.showNewRow[i] = false;
              this.showSaveSelection[i] = false;
              this.getPilotFeatures();
            })
          }
        });
      }
    }

    else if (this.pilotDataSource[i].status == 'ACTIVE') {
      const dialogRef = this.dialog.open(UpdatePilotDialogComponent);
      if (this.dialog.open) {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if ((this.pilotForm.get('selectedShopValue').value || this.pilotForm.get('selectedManagerValue').value || this.pilotForm.get('selectedDistrictValue').value) != null &&
              (this.pilotForm.get('selectedShopValue').value || this.pilotForm.get('selectedManagerValue').value || this.pilotForm.get('selectedDistrictValue').value) != "") {
              this.pilotService.updateFeatureToggleData(payload).subscribe(res => {
                this.showNewRow[i] = false;
                this.showSaveSelection[i] = false;
                this.onStartPilotCheck(i, this.pilotDataSource[i].status);
                const messageData = {
                  title: this.message.PILOTED_FEATURE_UPDATED_SUCCESSFULLY,
                  type: MessageType.success
                };
                this.notificationHelperService.emitNotificationChangeEvent(messageData);
                this.getPilotFeatures();
              })
            } else {
              this.pilotService.updateFeatureToggleData(payload).subscribe(res => {
                this.showNewRow[i] = false;
                this.showSaveSelection[i] = false;
                this.onStartPilotCheck(i, this.pilotDataSource[i].status == 'INACTIVE');
              })
            }
          } else {
            this.showNewRow[i] = true;
            this.showSaveSelection[i] = true;
          }
        });
      }
    }

  }

  allDropdownValues(i:number){
    this.selectedShopValue[i] = this.pilotForm.controls.selectedShopValue.value;
    this.selectedManagerValue[i] = this.pilotForm.controls.selectedManagerValue.value;
    this.selectedDistrictValue[i] = this.pilotForm.controls.selectedDistrictValue.value;
  }

  editSelection(i: number): void {
    this.enableDropdown();
    this.clearSelectionChanges(i);

    let existingIndex;
    this.pilotDataSource.forEach((value, index) => {
      if (this.showNewRow[index]) {
        existingIndex = index;
      }
    })
    if (!this.showNewRow[existingIndex]) {
      this.showNewRow[i] = true;
      this.showSaveSelection[i] = true;
      this.getSelectedDropdownValues(i);
    } else {
      this.closeRow(existingIndex, i);
    }
  }

  clearSelectionChanges(i: number) {
    this.showClearSelectionshop[i] = ((this.pilotForm.get('selectedShopValue').value != null) && (this.pilotForm.get('selectedShopValue').value != "")) ? true : false;
    this.showClearSelectionManager[i] = ((this.pilotForm.get('selectedManagerValue').value != null) && (this.pilotForm.get('selectedManagerValue').value != "")) ? true : false;
    this.showClearSelectionDistrict[i] = ((this.pilotForm.get('selectedDistrictValue').value != null) && (this.pilotForm.get('selectedDistrictValue').value != "")) ? true : false;

    if (this.showClearSelectionshop[i] || this.showClearSelectionManager[i] || this.showClearSelectionDistrict[i]) {
      this.disableSaveBtn[i] = false;
    } else {
      this.disableSaveBtn[i] = true;
    }

    if ((this.selectedShopValue[i] != this.pilotForm.controls.selectedShopValue.value) || (this.selectedManagerValue[i] != this.pilotForm.controls.selectedManagerValue.value) || (this.selectedDistrictValue[i] != this.pilotForm.controls.selectedDistrictValue.value)) {
      this.disableSaveBtn[i] = false;
    }

  }

  dropdownSelection(i: number) {
    this.clearSelectionChanges(i);
    // this.allShopData = false;
    // this.allManagerData = false;
    // this.allDistrictsData = false;
    
    this.allShopData = ((this.shopsFilter.length-1) == (this.pilotForm.get('selectedShopValue').value.length)) ? true : false;
    this.allManagerData = ((this.districtManagerFilter.length+1) == (this.pilotForm.get('selectedManagerValue').value.length)) ? true : false;
    this.allDistrictsData = ((this.districtsFilter.length+1) == (this.pilotForm.get('selectedDistrictValue').value.length)) ? true : false;

  }

  enableDropdown() {
    this.shops = this.shopsFilter;
    this.districtManager = this.districtManagerFilter;
    this.districts = this.districtsFilter;
    this.ddShopChecked = false;
    this.ddManagerChecked = false;
    this.ddDistrictChecked = false;
    this.ddShopCheckedAll = false;
    this.ddManagerCheckedAll = false;
    this.ddDistrictCheckedAll = false;
    this.pilotForm.get('shopName').reset();
    this.pilotForm.get('managerName').reset();
    this.pilotForm.get('districtsName').reset();
  }

  closeRow(i, newIndex): void {
    if ((this.selectedShopValue[i] == this.pilotForm.controls.selectedShopValue.value) && (this.selectedManagerValue[i] == this.pilotForm.controls.selectedManagerValue.value) && (this.selectedDistrictValue[i] == this.pilotForm.controls.selectedDistrictValue.value)) {
      this.showNewRow[i] = false;
      this.showSaveSelection[i] = false;
      if (newIndex >= 0) {
        this.showNewRow[newIndex] = true;
        this.showSaveSelection[newIndex] = true;
        this.getSelectedDropdownValues(newIndex);
      }
    } else {
      const dialogRef = this.dialog.open(UnsavedPilotDialogComponent);
      if (this.dialog.open) {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.showNewRow[i] = false;
            this.showSaveSelection[i] = false;
            if (newIndex >= 0) {
              this.showNewRow[newIndex] = true;
              this.showSaveSelection[newIndex] = true;
              this.getSelectedDropdownValues(newIndex);
            }
          } else {
            this.showNewRow[i] = true;
            this.showSaveSelection[i] = true;
          }
        });
      }
    }
  }

  getSelectedDropdownValues(i: number) {
    this.pilotForm.patchValue({ 'selectedShopValue': this.selectedShopValue[i] });
    this.pilotForm.patchValue({ 'selectedManagerValue': this.selectedManagerValue[i] });
    this.pilotForm.patchValue({ 'selectedDistrictValue': this.selectedDistrictValue[i] });

    this.clearSelectionChanges(i);
  }


  shopFilterValues(event: any): void {
    this.shops = this.shopsFilter;
    const searchEventS = event.target.value.toLowerCase();
    this.shops = this.shops.filter(ele => {
      return ele.toLowerCase().includes(searchEventS);
    })
  }

  managerFilterValues(event: any): void {
    this.districtManager = this.districtManagerFilter;
    const searchEventM = event.target.value.toLowerCase();
    this.districtManager = this.districtManager.filter(ele => {
      return ele.name.toLowerCase().includes(searchEventM);
    })
  }

  districtFilterValues(event: any): void {
    this.districts = this.districtsFilter;
    const searchEventD = event.target.value.toLowerCase();
    this.districts = this.districts.filter(ele => {
      return ele.districtTitle.toLowerCase().includes(searchEventD);
    })
  }

  shopSearchCleared() {
    this.pilotForm.get('shopName').reset();
    this.shops = this.shopsFilter;
  }
  managerSearchCleared() {
    this.pilotForm.get('managerName').reset();
    this.districtManager = this.districtManagerFilter;
  }
  districtSearchCleared() {
    this.pilotForm.get('districtsName').reset();
    this.districts = this.districtsFilter;
  }

  clearSelectionShop(i: number) {
    this.showClearSelectionshop[i] = false;
    this.pilotForm.get('selectedShopValue').reset();
    this.clearSelectionChanges(i);
  }
  clearSelectionMngr(i: number) {
    this.showClearSelectionManager[i] = false;
    this.pilotForm.get('selectedManagerValue').reset();
    this.clearSelectionChanges(i);
  }
  clearSelectionDist(i: number) {
    this.showClearSelectionDistrict[i] = false;
    this.pilotForm.get('selectedDistrictValue').reset();
    this.clearSelectionChanges(i);
  }

  sortTable(sort: Sort) {
    const data = this.pilotDataSource.slice();

    if (!sort.active || sort.direction === '') {
      this.currentSortColumn = 'none';
      return;
    }

    this.pilotDataSource = data.sort((a, b) => {
      const ascending = sort.direction === 'asc';
      this.sortDirection = !!ascending;

      switch (sort.active) {
        case 'description':
          this.currentSortColumn = 'description';
          return this.compareToSort(a.description, b.description, ascending);
        case 'status':
          this.currentSortColumn = 'status';
          return this.compareToSort(a.status, b.status, ascending);
        default:
          return 0;
      }
    });
  }

  sortIndicator(source: string): string {
    if (source === this.currentSortColumn) {
      return 'z';
    } else {
      return 'T';
    }
  }

  compareToSort(
    a: number | string | boolean | Date,
    b: number | string | boolean | Date,
    ascending: boolean
  ): number {
    return (a < b ? -1 : 1) * (ascending ? 1 : -1);
  }

}

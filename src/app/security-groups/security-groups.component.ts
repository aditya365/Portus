import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { securityGroup } from './models/securityGroup.model';
import { MatDialog } from '@angular/material/dialog';
import { SecurityGroupDetailsComponent } from './security-group-details/security-group-details.component';
import { SecurityGroupsService } from './security-groups.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';
/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'app-security-groups',
  styleUrls: ['./security-groups.component.css'],
  templateUrl: './security-groups.component.html'
})
export class SecurityGroupsComponent implements OnInit {
  filtersForm: FormGroup;
  filters: any;
  displayedColumns = [
    {
      key: 'groupName',
      displayName:'Group Name'
    },
    {
      key:'groupId',
      displayName:'Group Id'
    },
    {
      key: 'vpc',
      displayName:'VPC'
    },
    {
      key: 'AGS',
      displayName:'Application'
    }
  ];
  dataSource: MatTableDataSource<securityGroup>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog,
    private securityGroupsService: SecurityGroupsService) { }

  ngOnInit() {
    this.filtersForm = new FormGroup({
      account: new FormControl(''),
      region: new FormControl(''),
      vpc: new FormControl(''),
      application: new FormControl(''),
      securityGroup: new FormControl(''),
    });
    this.securityGroupsService.getFilters().subscribe((filters) => {
      this.filters = filters;
    });
  }

  getDisplayColumns(){
    return this.displayedColumns.map(c=>c.key);
  }

  renderSecurityGroups() {
    const filters = this.filtersForm.value;
    if (filters.account != '' && filters.region != '' && filters.vpc != '' && filters.application != '') {
      this.securityGroupsService.getSecurityGroupsData(filters.account, filters.region, filters.vpc, filters.application, filters.securityGroup).subscribe((data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  showDetails(element) {
    const dialogRef = this.dialog.open(SecurityGroupDetailsComponent, {
      data: {
        groupId: element.groupId
      }
    });
  }

}

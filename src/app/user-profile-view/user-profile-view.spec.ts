import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileView } from './user-profile-view';

describe('UserProfileView', () => {
  let component: UserProfileView;
  let fixture: ComponentFixture<UserProfileView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

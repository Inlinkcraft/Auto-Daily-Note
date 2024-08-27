import { Calendar } from 'Calendar/calendar';
import {Plugin, TFile, WorkspaceLeaf} from 'obsidian';
import { CALENDAR_DAY_VIEW_TYPE, CalendarDayView } from 'Views/dailyHomeView';

export default class AutoCalendars extends Plugin {

	mCalendar:Calendar;
	dayView:CalendarDayView;

	async onload() {

		this.mCalendar = new Calendar(this.app);
		this.registerView(CALENDAR_DAY_VIEW_TYPE, (leaf) => {
			this.dayView = new CalendarDayView(leaf, this.mCalendar)
			return this.dayView;
		});

		
		this.app.metadataCache.on("changed", (file, data, cache) => {
			console.log("changed update")
			let endDate = new Date();
			endDate.setMonth(endDate.getMonth() + 1);
			this.mCalendar.update(new Date(), endDate, () => {});
		})
		
		//this.app.vault.on("rename", (file, oldname) => {console.log(file.name, oldname)})

		this.addCommand({id: "open-day-calendar", name: "Open day calendar", callback: () => {
			//let endDate = new Date();
			//endDate.setMonth(endDate.getMonth() + 1);
			//this.mCalendar.update(new Date(), endDate, () => {
			this.openView(CALENDAR_DAY_VIEW_TYPE);
			//});
		}})

	}

	onunload() {
		// Cleanup !
	}

	async openView(pViewType:string) {
		
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(pViewType);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar.
			leaf = workspace.getRightLeaf(false);
			await leaf!.setViewState( {type: pViewType, active: true} );
		}

		workspace.revealLeaf(leaf!);

	}

}
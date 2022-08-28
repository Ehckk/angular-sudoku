import { ModuleWithProviders, NgModule } from "@angular/core";
import { SudokuService } from "src/services/sudoku.service";

@NgModule({})
export class SharedModule {
	static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [SudokuService]
		}
	}
}
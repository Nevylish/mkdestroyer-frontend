export namespace Constants {

    export const educationModeEnabled: boolean = false;
    export const alertHeaderDefaultText: string = educationModeEnabled ?
        // Low performance alert bcs backend server is hosted on repl.it when education mode is enabled.
        "Backend server performance is limited. Attacks cannot be launched if several are already in progress." :
        // Disabled backend alert when education mode is disabled
        "The backend server is closed to prevent abusive and illegal use.";
}
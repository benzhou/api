#!/bin/bash
#Brackets API deploy & restart script
#Variables
application=$1
action=$2

rootDir="/usr/local/Brackets"
currDir="$rootDir/current"

#bracketsDIR="/www/sites/brackets-dev.tritondigital.net/htdocs/js"
bracketsDIR="$currDir/www/js"

#sourceDIR="/home/brackets/BracketsCode/di-brackets-"
sourceDIR="$currDir/source/di-brackets-"

#APItmpDIR="/home/brackets/tmp/API"
APItmpDIR="$currDir/tmp/API"
schedulerTmpDIR="$currDir/tmp/Scheduler"

logDir="/var/log/Brackets"

cont=$true

NOW=$(date '+%Y%m%d%H%M%S')


stopAPI(){
    echo "-------------------------------------------";
    echo "Brackets API will be stopped now...";
    cd $bracketsDIR/BracketsAPI;
    forever stop $bracketsDIR/BracketsAPI/application.js;
    echo "Brackets API stopped...";
}

startAPI(){
    echo "-------------------------------------------";
    echo "Brackets API will be started now...";
    echo "Archiving off old Logs";
    mkdir -p "$logDir/old"
    find $logDir -name "*.log" -exec mv {} $logDir/old/$NOW-BracketsAPI.log \;
    find "$logDir/old" -name "*.log" -exec gzip {} \;

    cd $bracketsDIR/BracketsAPI;
    forever start -l $logDir/BracketsAPI.log $bracketsDIR/BracketsAPI/application.js;
    echo "Brackets API started...";
}

#Deploy Brackets API function
deployAPI(){
    echo "-------------------------------------------";
    echo "Brackets API will be deployed now ...";
    stopAPI
    echo "Brackets API stopped...";

        switch_dir

        cd $bracketsDIR/BracketsAPI;
    #Pull latest changes from git
    echo "Pulling code from git...";
    cd $sourceDIR;
    git pull;

    #Copy latest changes to deploy directory
    echo "Deploying Brackets API...";
    echo "Backing up configs first"
    cp -a $bracketsDIR/BracketsAPI/config/* $APItmpDIR;
    cp -r $sourceDIR/BracketsAPI $bracketsDIR;
    cp -a $APItmpDIR/* $bracketsDIR/BracketsAPI/config;

    #Navigate to Brackets API directory and start app
    if $cont ; then
        cd $bracketsDIR/BracketsAPI;
                chown -R nginx:nginx $currDir
        npm install;
        startAPI
    fi
}

stopScheduler(){
    echo "-------------------------------------------";
    echo "Brackets scheduler will be stopped now...";
    cd $bracketsDIR/BracketsScheduler;
    forever stop $bracketsDIR/BracketsScheduler/scheduler.js;
    echo "Brackets scheduler stopped...";
}

startScheduler(){
    echo "-------------------------------------------";
    echo "Brackets scheduler will be started now...";

    echo "Archiving off old Logs";
        mkdir -p "$logDir/old"
        find $logDir -name "*.log" -exec mv {} $logDir/old/$NOW-Scheduler.log \;
        find "$logDir/old" -name "*.log" -exec gzip {} \;

    cd $bracketsDIR/BracketsScheduler;
    forever start -l $logDir/Scheduler.log $bracketsDIR/BracketsScheduler/scheduler.js;
    echo "Brackets scheduler started...";
}

#Deploy Brackets scheduler function
deployScheduler(){
    echo "-------------------------------------------";
    echo "Brackets scheduler will be deployed now ...";
    cd $bracketsDIR/BracketsScheduler;
    stopScheduler
    echo "Brackets scheduler stopped...";

        switch_dir

    #Pull latest changes from git
    echo "Pulling code from git...";
    cd $sourceDIR;
    git pull;

    #Copy latest changes to deploy directory
    echo "Deploying Brackets scheduler...";
    cp -a $bracketsDIR/BracketsScheduler/config/* $schedulerTmpDIR;
    cp -r $sourceDIR/BracketsScheduler $bracketsDIR;
    cp -a $schedulerTmpDIR/* $bracketsDIR/BracketsScheduler/config;

    #Navigate to Brackets scheduler directory and start app
    if $cont ; then
        cd $bracketsDIR/BracketsScheduler;
                chown -R nginx:nginx $currDir
        npm install;
        startScheduler
    fi
}

switch_dir() {
        now=$(date +"%Y%m%d-%H-%M")
        newDir="$rootDir/$now"
        echo "Creating New Dir $newDir"
        mkdir -p $newDir
        cp -a $currDir/* $newDir/
        echo "Switch Links $currDir"
        unlink $currDir
        ln -s $newDir $currDir
}

#Execute selected actions
case $application in
    api)
        if [ "$action" = "deploy" ]
        then
            deployAPI
        fi

                if [ "$action" = "stop" ]
                then
                    stopAPI
                fi

                if [ "$action" = "start" ]
                then
                    startAPI
                fi

                if [ "$action" = "restart" ]
                then
                    stopAPI
                    startAPI
                fi
        ;;
    scheduler)
        if [ "$action" = "deploy" ]
        then
            deployScheduler
        fi

                if [ "$action" = "stop" ]
                then
            stopScheduler
        fi

                if [ "$action" = "start" ]
                then
                    startScheduler
                fi

                if [ "$action" = " restart" ]
                then
                    stopScheduler
                    startScheduler
                fi
        ;;
    all)
        if [ "$action" = "deploy" ]
        then
            deployAPI
            deployScheduler
        else
            stopAPI
                        startAPI
            stopScheduler
                        startScheduler
        fi;
        ;;
        *)
            echo "Please supply an app (api scheduler all) and an action (deploy start stop restart) [app action]"
            ;;
esac
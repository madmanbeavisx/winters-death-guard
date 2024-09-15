import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt/services/mod/CustomItemService";
import { NewItemDetails } from "@spt/models/spt/mod/NewItemDetails";
import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

import { WhiteDeathTemplate } from "./Items/facemasks/ItemWhiteDeath"
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import * as fs from "fs";
import * as path from "path";
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";

class Mod implements IPreSptLoadMod, IPostDBLoadMod, IPostSptLoadMod
{
    private modName: string = "Winters Death Gear"
    private version: string;
    private logger: ILogger;

    public preSptLoad(container: DependencyContainer): void {
        this.getVersionFromJson()
        this.logger = container.resolve<ILogger>("WinstonLogger");

        this.displayCredits();
    }

    
    public postDBLoad(container: DependencyContainer): void
    {
        // Resolve the CustomItemService container
        const CustomItem = container.resolve<CustomItemService>("CustomItemService");
        
        //Example of adding new item by cloning existing item using createclonedetails
        const WhiteDeathMaskItem: NewItemDetails = { //the item we want to clone, in this example i will cloning the MP-18
            newItem: WhiteDeathTemplate,
            fleaPriceRoubles: 100000, //Self explanatary
            handbookPriceRoubles: 82500,
            handbookParentId: "5b47574386f77428ca22b32f", //Handbook Parent Id refers to the category the gun will be under
            //you see those side box tab thing that only select gun under specific icon? Handbook parent can be found in Aki_Data\Server\database\templates.
            locales: {
                en: {
                    name: "White Death heavyweight armored mask",
                    shortName: "White Death",
                    description: "The \"White Death\" mask for face protection, reinforced with titan plating.",
                },
            },
        };
        
        CustomItem.createItem(WhiteDeathMaskItem); //Basically calls the function and tell the server to add our Cloned new item into the server
    }
    
    private getVersionFromJson(): void 
    {
        const packageJsonPath = path.join(__dirname, "../package.json");
        
        fs.readFile(packageJsonPath, "utf-8", (err, data) => 
        {
            if (err) 
            {
                console.error("Error reading file:", err);
                return;
            }
        
            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }
        
            
    //Check if our item is in the server or not
    public postSptLoad(container: DependencyContainer): void {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const item = db.getTables().templates.items;
    }    
            
    private displayCredits() {
        this.logger.log(`[${this.modName}] *********************************************`, LogTextColor.BLUE);
        this.logger.log(`[${this.modName}] ** ${this.modName} - ${this.version}**`, LogTextColor.BLUE);
        this.logger.log(`[${this.modName}] **** My first mod to bring to you guys. *****`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] **** Developers:           MadManBeavis *****`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] **** Be gentile it's my first time ;) *******`, LogTextColor.GREEN);
        this.logger.log(`[${this.modName}] *********************************************`, LogTextColor.BLUE);
    }
}
        
export const mod = new Mod();
        
import { initAdminSettings } from "@/app/actions/init-admin-settings";


async function initSystem() {
  console.log("Initializing system settings...");
  
  try {
    
    const adminInitResult = await initAdminSettings();
    
    if (adminInitResult) {
      console.log("✅ Admin settings initialized successfully");
    } else {
      console.error("❌ Failed to initialize admin settings");
    }
  } catch (error) {
    console.error("❌ Error during system initialization:", error);
  }
}


initSystem()
  .then(() => console.log("System initialization completed"))
  .catch((error) => console.error("System initialization failed:", error));

export {};

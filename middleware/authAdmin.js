import { clerkClient,} from "@clerk/nextjs/server"

const authAdmin = async (userId) => {
    try {
        if (!userId) return false;

        // FIXED: Corrected the clerkClient instantiation typo
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        
        // Safely pull the role string from metadata
        const userRole = user.publicMetadata?.role;

        // FIXED: Return a clean primitive boolean
        if (userRole === "admin") {
            return true;
        }

        console.warn(`-> SECURITY WARN: Non-admin account ${userId} attempted to access an administrative area.`);
        return false;
        
    } catch (error) {
        if (error.clerkError && error.errors) {
            console.error("CLERK API REFUSED REQUEST:", JSON.stringify(error.errors, null, 2));
        } else {
            console.error("Administrative authentication utility failure:", error);
        }
        return false
    }
}

export default authAdmin;
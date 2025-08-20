const categories = {
    tutorials: [
        {
            title: "Creating an organization",
            content:
                <>
                    <p>To create an organization, go to the <strong>Join Organization</strong> menu, click <strong>Create</strong>, and choose a name. Only authorized users can perform this action. If you'd like a personal organization for testing or research, please contact me at: <i>tonieserban@yahoo.ro</i></p>
                    <p>After creating your organization, log out and back in to refresh your account. Once logged in, you'll see additional menu options on the left (if this is your first organization). Otherwise, you can switch to your new organization from the menu in the top-right corner.</p>
                </>
        },
        {
            title: "Setting up your organization",
            content:
                <>
                    <p>Before fully using the app, you need to configure some initial settings:</p>
                    <p>1. <strong>Upload a Frog Image</strong> - Go and upload your first frog image. Certain settings remain locked until this step is complete.</p>
                    <p>2. <strong>Choose Frog Attributes</strong> - After uploading, return to Organization Settings and select which attributes your frogs should have. You can use predefined options or create your own. Don't forget to save, a green notification will confirm success.</p>
                    <p>3. <strong>Select Frog Table Columns</strong> - Decide which attributes to display in the frog table. You can choose from your custom attributes and include the frog ID (a combination of frog number and tank).</p>
                    <p>4. <strong>Create Tanks</strong> - Add tanks for your frogs by giving each one a unique name (e.g., Tank 1, Tank 2).</p>
                </>
        },
        {
            title: "Changing user access rights",
            content:
                <>
                    <p>By default, non-admin users can only upload images and view frog details. To grant additional permissions:</p>
                    <p>1. Go to the <strong>Organization Settings</strong> page.</p>
                    <p>2. Under <strong>User Access Rights</strong>, click the desired user.</p>
                    <p>3. Check the boxes for the permissions you want to assign. You can select multiple rights, then click <strong>Save</strong>.</p>
                    <p>⚠️ <strong>Important</strong>: The last three access rights are sensitive — grant them only to trusted users. If you need another admin in your organization, contact me directly. Admins can change organization settings and, if granted the rights, manage other users' access.</p>
                </>
        },
        {
            title: "Keeping track of system parameters",
            content:
                <>
                    <p>System parameters let you record non-frog data, such as water pH or temperature.</p>
                    <p>&#x2022; First, add the parameters you want to track in <strong>Organization Settings</strong>.</p>
                    <p>&#x2022; Then, in the <strong>System Parameters</strong> menu, you can add one row per day. Each parameter you created will appear as a column in the table, making it easy to log daily values.</p>
                </>
        }
    ],
    errors: [
        {
            title: "Could not extract frog from image",
            content:
                <>
                    <p>This error occurs when the algorithm fails to successfully extract the frog pattern from the image. Several factors can contribute to this issue, such as the image being too blurry, too small, too large, or the frog pattern not being sufficiently visible.</p>
                    <p>To minimize the risk of this error, ensure that the image is clear, the frog pattern is visible, and the image resolution is ideally around 3000x4000 pixels. It's recommended to place the frog on the designated box, use a tripod to take the photo and remove any darker colored objects from the frame.</p>
                    <p>Additionally, capture the image in a well-lit environment, avoiding any shadows on the frog. If the error continues, try changing the angle or using a different camera.</p>
                    <p>Below you can find examples of good and bad images:</p>
                    <div className="example-images-container">
                        <figure className="example-image-figure">
                            <img src="/help-page/bad-frog.jpg" alt="bad-frog" className="example-image" />
                            <figcaption>Bad image</figcaption>
                        </figure>
                        <figure className="example-image-figure">
                            <img src="/help-page/good-frog.jpg" alt="good-frog" className="example-image" />
                            <figcaption>Good image</figcaption>
                        </figure>
                    </div>
                    <p>Here are a few reasons why the bad image can't be processed: the aspect ratio is not 4:3, it is blurry and the pattern on the back is not visible to the eye, compared to the image on the right.</p>
                </>
        },
        {
            title: "Network Error",
            content: <p>A network error may occur if the server is temporarily unavailable or if your authentication token has expired. To fix this, try logging in again. If the issue persists, wait a few minutes and attempt to connect later.
                If the problem still continues, it could be a system bug. In that case, please contact me by email and include a detailed description of the error and the action you were attempting when it happened.</p>
        },
        {
            title: "Unauthorized Error",
            content: <p>This error arises when you attempt to modify details related to the organization or frogs without the necessary permissions. Ensure you have the appropriate access rights before making any changes.</p>
        }
    ]
};

export default categories;
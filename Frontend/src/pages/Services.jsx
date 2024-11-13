
function Services() {
  return (
    <div>
       <div class=" h-auto px-10">
        <h1 className="font-bold text-3xl">Our Services</h1>

        <div class="service-item">
            <p class="service-title">1. Anonymous Reporting System</p>
            <ul class="service-list">
                <li class="service-description">Women can report incidents of violence, harassment, or abuse without revealing their identity.</li>
                <li class="service-description">The platform generates a unique case ID for each report, allowing users to track their cases anonymously.</li>
            </ul>
        </div>

        <div class="service-item">
            <p class="service-title">2. Secure Communication with NGOs</p>
            <ul class="service-list">
                <li class="service-description">Victims can communicate directly with registered and verified NGOs through a secure messaging system.</li>
                <li class="service-description">NGOs only see information that the user chooses to share, ensuring privacy and control over personal details.</li>
                <li class="service-description">This communication can include seeking counseling, legal advice, or support services without the fear of identity exposure.</li>
            </ul>
        </div>

        <div class="service-item">
            <p class="service-title">3. Preliminary Verification</p>
            <ul class="service-list">
                <li class="service-description">The platform asks targeted, incident-specific questions to assess the credibility of the report.</li>
                <li class="service-description">Users can optionally upload non-identifiable evidence (like photos or location data) to support their claims, helping NGOs assess the case without compromising privacy.</li>
                <li class="service-description">This helps in reducing false reports and ensures genuine cases get the necessary attention.</li>
            </ul>
        </div>

        <div class="service-item">
            <p class="service-title">4. Listing of Verified NGOs</p>
            <ul class="service-list">
                <li class="service-description">Users can browse through a list of verified NGOs that are rated and reviewed for their work in supporting women's safety.</li>
                <li class="service-description">The platform ensures that only legitimate and trustworthy NGOs are listed, enhancing trust among users.</li>
            </ul>
        </div>

        <div class="service-item">
            <p class="service-title">5. Privacy and Data Protection</p>
            <ul class="service-list">
                <li class="service-description">The platform is designed to protect user identities by preventing any unintended information leakage.</li>
                <li class="service-description">No additional personal information is shared with NGOs unless the user explicitly chooses to do so.</li>
                <li class="service-description">Features like automatic chat deletion after a certain time can be implemented to further safeguard user privacy.</li>
            </ul>
        </div>
    </div>
    </div>
  )
}

export default Services

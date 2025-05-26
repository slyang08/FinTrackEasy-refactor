import React from "react";

export default function Terms() {
    return (
        <div className="bg-gray-50 w-full text-gray-800">
            <main className="max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-lg shadow mt-10 space-y-8">
                <h1 className="text-3xl font-semibold">FinTrackEasy - Terms of Service</h1>
                <p className="mt-2 text-sm">Effective Date: April 24, 2025</p>
                <section>
                    <h2 className="text-xl font-semibold text-blue-600">
                        1. Eligibility and Account Registration
                    </h2>
                    <p className="mt-2">
                        To use FinTrackEasy, you must be at least 18 years old or have the
                        permission of a legal guardian. You must create an account and provide
                        accurate, complete, and up-to-date personal information. You are responsible
                        for safeguarding your password and all activity under your account.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">2. Use of the Service</h2>
                    <p className="mt-2">
                        FinTrackEasy provides tools to help users track their income, expenses, and
                        other personal financial data. The Service is currently free of charge.
                    </p>
                    <p className="mt-2">
                        You agree not to use the Service for any commercial, illegal, or
                        unauthorized purpose. You must comply with all applicable local, provincial,
                        and federal laws when using our platform.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">
                        3. Privacy and Data Collection
                    </h2>
                    <p className="mt-2">
                        By using FinTrackEasy, you consent to the collection and use of your
                        personal information as outlined in our{" "}
                        <a href="#" className="text-blue-500 hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                    <p className="mt-2">
                        We collect limited personal data, such as your name, email address, and
                        financial inputs you voluntarily provide. We do not sell your personal
                        information to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">
                        4. Data Accuracy and Responsibility
                    </h2>
                    <p className="mt-2">
                        FinTrackEasy provides estimates and tracking tools based on the information
                        you input. We are not responsible for any inaccuracies in user-provided data
                        or financial outcomes resulting from its use.
                    </p>
                    <p className="mt-2">
                        We are not a financial advisory service and do not provide financial,
                        investment, or legal advice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">5. Account Termination</h2>
                    <p className="mt-2">
                        You may delete your account at any time. We reserve the right to suspend or
                        terminate your account if you violate these Terms, or if we suspect
                        fraudulent or harmful activity.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">
                        6. Intellectual Property
                    </h2>
                    <p className="mt-2">
                        All content, design, and features on FinTrackEasy are the property of
                        FinTrackEasy and are protected by Canadian and international copyright and
                        intellectual property laws. You may not copy, reproduce, or distribute our
                        content without written permission.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">7. Changes to the Terms</h2>
                    <p className="mt-2">
                        We may update these Terms from time to time. We will notify you of material
                        changes by email or via the Service. Continued use after such changes
                        constitutes your acceptance of the new Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">8. Governing Law</h2>
                    <p className="mt-2">
                        These Terms are governed by the laws of the Province of Ontario and the
                        federal laws of Canada. Any disputes arising under these Terms shall be
                        subject to the exclusive jurisdiction of the courts located in Toronto,
                        Ontario.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-blue-600">9. Contact Us</h2>
                    <p className="mt-2">
                        If you have any questions about these Terms, you can contact us at:
                    </p>
                    <p className="mt-2 font-medium">
                        FinTrackEasy
                        <br />
                        Toronto, ON, Canada
                        <br />
                        📧{" "}
                        <a
                            href="mailto:fintrackeasy@gmail.com"
                            className="text-blue-500 hover:underline"
                        >
                            fintrackeasy@gmail.com
                        </a>
                    </p>
                </section>
            </main>
        </div>
    );
}

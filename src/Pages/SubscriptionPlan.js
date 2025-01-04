import React from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="back-button"
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        <IonIcon icon={arrowBackOutline} className="back-icon" />
        Back
      </button>
      <div className="bg-gradient-to-b from-[#ff6f20] to-[#ff6f20]/90 p-6 rounded-lg text-white">
        <h1 className="text-3xl font-bold mb-4">
          POWER UP YOUR SOLAR BUSINESS!
        </h1>

        <div className="bg-white text-[#ff6f20] p-4 rounded-lg shadow-lg mb-6">
          <h3 className="text-4xl font-bold">$27</h3>
          <p className="text-xl">/month</p>
          <p className="font-semibold">ALL-IN-ONE</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-[#ff6f20] text-xl font-bold mb-4">
              Your Solar Business Toolkit
            </h2>
            <ul className="space-y-3 text-[#ff6f20]">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Access to the seller dashboard
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Access performance reports and customer data
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Highlight your business at the top of search results
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Email support during business hours
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Regular software updates and bug fixes
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Free Registration – No initial cost to join
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-[#ff6f20] text-xl font-bold mb-4">
              Leads + Features + Growth
            </h2>
            <ul className="space-y-3 text-[#ff6f20]">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Direct WhatsApp button for customers to instantly contact you
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Company Logo & Branding – Stand out with your unique identity
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Receive verified inquiries directly from interested customers
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Showcase your solar packages
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Convert leads faster with detailed customer insights
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                Optimize your online presence for higher visibility
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-[#ff6f20] p-4 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="font-bold">New to 7solar.pk</span>
              <span>GET 100% DISCOUNT COUPON CODE</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Call or WA: +92 307 317 1777</span>
              <span>ask@7solar.pk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;

import { Link } from "react-router-dom";
import classes from "./PrivacyPolicy.module.scss";
import { useEffect } from "react";
import LinkA from "../components/ui/LinkA";
import Card from "../components/ui/Card";
import { motion } from "framer-motion";
import { ANIMATION_SLIDE_IN, ANIMATION_SLIDE_IN_INITIAL } from "../variables/constants";

const PrivacyPolicy = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div initial={ANIMATION_SLIDE_IN_INITIAL} animate={ANIMATION_SLIDE_IN}>
    <Card className={classes.policy}>
      <h1 className={classes["policy__h1"]}>
        <strong>Privacy Policy</strong>
      </h1>
      <p className={classes["policy__text"]}>
        "Your recipe book" ("we," "our," or "us") is committed to protecting
        your privacy. This Privacy Policy explains how we collect, use, and
        safeguard your personal information when you access our website and
        Services.
      </p>
      <h4 className={classes["policy__h4"]}>
        1. <strong>Information We Collect</strong>
      </h4>
      <p className={classes["policy__text"]}>
        We collect the following types of information:
      </p>
      <ul className={classes["policy__list"]}>
        <li className={classes["policy__list-item"]}>
          <strong>Personal Information:</strong> Information you provide, such
          as your name, email address, payment details, and account credentials.
        </li>
        <li className={classes["policy__list-item"]}>
          <strong>Usage Data:</strong> Information about how you use our
          Services, including IP addresses, browser types, and interactions with
          the website.
        </li>
        <li className={classes["policy__list-item"]}>
          <strong>Cookies and Tracking Technologies:</strong> Data collected
          through cookies and similar technologies to enhance your experience
          and analyze usage patterns.
        </li>
      </ul>
      <h4 className={classes["policy__h4"]}>
        2. <strong>How We Use Your Information</strong>
      </h4>
      <p className={classes["policy__text"]}>We use your information to:</p>
      <ul className={classes["policy__list"]}>
        <li className={classes["policy__list-item"]}>
          Provide and improve our Services.
        </li>
        <li className={classes["policy__list-item"]}>
          Respond to your inquiries and provide customer support.
        </li>
        <li className={classes["policy__list-item"]}>
          Process payments and transactions.
        </li>
        <li className={classes["policy__list-item"]}>
          Send you updates, promotions, and notifications (you may opt out of
          these communications at any time).
        </li>
      </ul>
      <h4 className={classes["policy__h4"]}>
        3. <strong>Sharing Your Information</strong>
      </h4>
      <p className={classes["policy__text"]}>
        We do not sell your personal information. However, we may share your
        information with:
      </p>
      <ul className={classes["policy__list"]}>
        <li className={classes["policy__list-item"]}>
          <strong>Service Providers:</strong> Third-party vendors who assist in
          delivering our Services (e.g., payment processors, hosting providers).
        </li>
        <li className={classes["policy__list-item"]}>
          <strong>Legal Authorities:</strong> When required by law or necessary
          to protect our rights and users.
        </li>
      </ul>
      <h4 className={classes["policy__h4"]}>
        4. <strong>Your Rights</strong>
      </h4>
      <p className={classes["policy__text"]}>
        You have the following rights regarding your personal data:
      </p>
      <ul className={classes["policy__list"]}>
        <li className={classes["policy__list-item"]}>
          Access, update, or delete your personal information.
        </li>
        <li className={classes["policy__list-item"]}>
          Withdraw consent for data processing at any time.
        </li>
        <li className={classes["policy__list-item"]}>
          Opt out of marketing communications.
        </li>
      </ul>
      <p className={classes["policy__text"]}>
        To exercise these rights, contact us.
      </p>
      <h4 className={classes["policy__h4"]}>
        5. <strong>Data Retention</strong>
      </h4>
      <p className={classes["policy__text"]}>
        We retain your personal data only for as long as necessary to fulfill
        the purposes outlined in this policy, unless a longer retention period
        is required by law.
      </p>
      <h4 className={classes["policy__h4"]}>
        6. <strong>Security of Your Information</strong>
      </h4>
      <p className={classes["policy__text"]}>
        We use reasonable technical and organizational measures to protect your
        information from unauthorized access, disclosure, or loss.
      </p>
      <h4 className={classes["policy__h4"]}>
        7. <strong>Cookies and Tracking Technologies</strong>
      </h4>
      <p className={classes["policy__text"]}>
        Our website uses cookies to enhance your browsing experience. You can
        manage your cookie preferences through your browser settings.
      </p>
      <h4 className={classes["policy__h4"]}>
        8. <strong>Policy Updates</strong>
      </h4>
      <p className={classes["policy__text"]}>
        We may update this Privacy Policy periodically. Changes will be
        effective immediately upon posting. Your continued use of our Services
        constitutes your acceptance of the revised policy.
      </p>
      <p className={classes["policy__text"]}>
        If you have questions about this Privacy Policy, contact us.
      </p>
    </Card>
    </motion.div>
  );
};

export default PrivacyPolicy;

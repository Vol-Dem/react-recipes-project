import { useEffect } from "react";
import LinkA from "../components/ui/LinkA";
import classes from "./ToS.module.scss";
import { NavLink } from "react-router-dom";
import Card from "../components/ui/Card";

const ToS = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Card className={classes.tos}>
      <h1 className={classes["tos__h1"]}>Terms of Service</h1>
      <p className={classes["tos__text"]}>
        Welcome to "Your recipe book" web application ("Website"). These Terms
        of Service ("Terms") govern your access to and use of our website,
        products, and services ("Services"). By accessing or using our Services,
        you agree to be bound by these Terms. If you do not agree, please do not
        use our Services.
      </p>
      <h4 className={classes["tos__h4"]}>
        1. <strong>Acceptance of Terms</strong>
      </h4>
      <p className={classes["tos__text"]}>
        By accessing or using Website, you confirm that you are at least the age
        of majority in your jurisdiction or have obtained parental consent to
        use our Services.
      </p>
      <h4 className={classes["tos__h4"]}>
        2. <strong>Modifications to Terms</strong>
      </h4>
      <p className={classes["tos__text"]}>
        We reserve the right to modify these Terms at any time. Changes will be
        effective immediately upon posting. It is your responsibility to review
        the Terms periodically for updates. Continued use of the Services after
        modifications signifies your acceptance of the updated Terms.
      </p>
      <h4 className={classes["tos__h4"]}>
        3. <strong>Use of Services</strong>
      </h4>
      <ul className={classes["tos__list"]}>
        <li className={classes["tos__list-item"]}>
          You agree to use the Services only for lawful purposes and in
          accordance with these Terms.
        </li>
        <li className={classes["tos__list-item"]}>
          Prohibited activities include, but are not limited to:
          <ul className={classes["tos__list"]}>
            <li className={classes["tos__list-item"]}>
              Engaging in fraudulent, harmful, or malicious activities.
            </li>
            <li>Violating any applicable laws or regulations.</li>
            <li className={classes["tos__list-item"]}>
              Attempting to disrupt or gain unauthorized access to the Services.
            </li>
          </ul>
        </li>
      </ul>
      <h4 className={classes["tos__h4"]}>
        4. <strong>Account Responsibilities</strong>
      </h4>
      <ul className={classes["tos__list"]}>
        <li className={classes["tos__list-item"]}>
          You are responsible for maintaining the confidentiality of your
          account and password and for all activities under your account.
        </li>
        <li className={classes["tos__list-item"]}>
          You agree to notify us immediately of any unauthorized access or
          breach of security.
        </li>
      </ul>
      <h4 className={classes["tos__h4"]}>
        5. <strong>Intellectual Property</strong>
      </h4>
      <ul className={classes["tos__list"]}>
        <li className={classes["tos__list-item"]}>
          All content on the Services, including text, graphics, logos, and
          software, is the property of Website or its licensors and is protected
          by intellectual property laws.
        </li>
        <li className={classes["tos__list-item"]}>
          You may not reproduce, distribute, or create derivative works without
          our express written consent.
        </li>
      </ul>
      <h4 className={classes["tos__h4"]}>
        6. <strong>Limitation of Liability</strong>
      </h4>
      <p className={classes["tos__text"]}>
        To the fullest extent permitted by law, Website shall not be liable for
        any direct, indirect, incidental, consequential, or punitive damages
        resulting from your use or inability to use the Services.
      </p>
      <h4 className={classes["tos__h4"]}>
        7. <strong>Termination</strong>
      </h4>
      <p className={classes["tos__text"]}>
        We may suspend or terminate your access to the Services at our sole
        discretion, without notice, for any violation of these Terms or other
        harmful behavior.
      </p>
      <h4 className={classes["tos__h4"]}>
        8. <strong>Governing Law</strong>
      </h4>
      <p className={classes["tos__text"]}>
        These Terms are governed by and construed in accordance with the laws of
        Ukraine. Any disputes arising from these Terms will be subject to the
        exclusive jurisdiction of the courts in Website.
      </p>
      {/* <h1 className={classes["tos__h1"]}>Terms of Service</h1>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        These Terms of Service are a legally binding contract between you and
        AIDE-TOOLS regarding your use of the Service.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        PLEASE READ THE FOLLOWING TERMS CAREFULLY: BY CLICKING &ldquo;I
        ACCEPT,&rdquo; OR BY ACCESSING OR USING THE SERVICE, YOU AGREE THAT YOU
        HAVE READ AND UNDERSTOOD, AND, AS A CONDITION TO YOUR USE OF THE
        SERVICE, YOU AGREE TO BE BOUND BY, THE FOLLOWING TERMS AND CONDITIONS,
        INCLUDING AIDE-TOOLS&rsquo; PRIVACY POLICY (TOGETHER, THESE
        &ldquo;TERMS&rdquo;). IF YOU ARE NOT ELIGIBLE, OR DO NOT AGREE TO THE
        TERMS, THEN YOU DO NOT HAVE OUR PERMISSION TO USE THE SERVICE. YOUR USE
        OF THE SERVICE CONSTITUTES AN AGREEMENT BY AIDE-TOOLS AND BY YOU TO BE
        BOUND BY THESE TERMS.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        ARBITRATION NOTICE. EXCEPT FOR CERTAIN KINDS OF DISPUTES DESCRIBED IN
        SECTION 18 (DISPUTE RESOLUTION AND ARBITRATION), YOU AGREE THAT DISPUTES
        ARISING UNDER THESE TERMS WILL BE RESOLVED BY BINDING, INDIVIDUAL
        ARBITRATION, AND BY ACCEPTING THESE TERMS, YOU AND AIDE-TOOLS ARE EACH
        WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN ANY CLASS
        ACTION OR REPRESENTATIVE PROCEEDING.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        THE AVAILABILITY AND OPERATION OF THE FUNCTIONS DECLARED ON THE PLATFORM
        DEPEND ENTIRELY ON THE CIVITAI API, THEREFORE AIDE-TOOLS CANNOT
        GUARANTEE THE PERFORMANCE AND STABILITY OF THE PLATFORM. AIDE-TOOLS IS A
        NON-COMMERCIAL PROJECT, AND THE DEVELOPER IS NOT RESPONSIBLE FOR THE
        TERMINATION OF THE SERVICE FOR REASONS BEYOND ITS CONTROL. BY CONTINUING
        TO USE THE PLATFORM, YOU AGREE TO THESE TERMS AND CONFIRM THAT YOU
        UNDERSTAND THE RISKS ASSOCIATED WITH THE TERMINATION OF THE SERVICE.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        1. Overview. AIDE-TOOLS is a non-profit project made by an enthusiast to
        improve the experience of working with the prompt for generating images.
        The platform contains many features that create a comfortable workspace
        for building the prompt and collecting your favorite models from
        Civitai.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        2. Eligibility. You must be at least 18 years old to use the Service. By
        agreeing to these Terms, you represent and warrant to us that: (a) you
        are at least 18 years old; (b) you have not previously been suspended or
        removed from the Service; and (c) your registration and your use of the
        Service is in compliance with any and all applicable laws and
        regulations. If you are an entity, organization, or company, the
        individual accepting these Terms on your behalf represents and warrants
        that they have authority to bind you to these Terms and you agree to be
        bound by these Terms.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        3. Accounts and Registration. To access most features of the Service,
        you must register for an account, whether directly or through a third
        party integration (&ldquo;Account&rdquo;). When you register for an
        Account, you may be required to provide us with some information about
        yourself, such as your name, username, email address, or other contact
        information. You agree that the information you provide to us is
        accurate, complete, and not misleading, and that you will keep it
        accurate and up to date at all times. When you register, you will be
        asked to create a password. You are solely responsible for maintaining
        the confidentiality of your Account and password, and you accept
        responsibility for all activities that occur under your Account. If you
        believe that your Account is no longer secure, then you should
        immediately notify us at{" "}
        <LinkA href="mailto:support@aide-tools.com">
          support@aide-tools.com
        </LinkA>
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        4. AIDE-TOOLS is a non-profit project, no goods or services are sold or
        bought on the site. If you want to support the project, you can donate
        to ko-fi or patreon. Any donations are voluntary and non-refundable.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>5. Licenses</p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        5.1 Limited License. Subject to your complete and ongoing compliance
        with these Terms, AIDE-TOOLS grants you, solely for your personal,
        non-commercial use, a limited, non-exclusive, non-transferable,
        non-sublicensable, revocable license to: (a) install and use one object
        code copy of any mobile or other downloadable application associated
        with the Service (whether installed by you or pre-installed on your
        mobile device by the device manufacturer or a wireless telephone
        provider) on a mobile device that you own or control; and (b) access and
        use the Service.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        5.2 License Restrictions. Except and solely to the extent such a
        restriction is impermissible under applicable law, you may not: (a)
        reproduce, distribute, publicly display, publicly perform, or create
        derivative works of the Service; (b) make modifications to the Service;
        or (c) interfere with or circumvent any feature of the Service,
        including any security or access control mechanism. If you are
        prohibited under applicable law from using the Service, then you may not
        use it.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        5.3 Feedback. We respect and appreciate the thoughts and comments from
        our Users If you choose to provide input and suggestions regarding
        existing functionalities, problems with or proposed modifications or
        improvements to the Service (&ldquo;Feedback&rdquo;), then you hereby
        grant AIDE-TOOLS an unrestricted, perpetual, irrevocable, non-exclusive,
        fully-paid, royalty-free right and license to exploit the Feedback in
        any manner and for any purpose, including to improve the Service and
        create other products and services. We will have no obligation to
        provide you with attribution for any Feedback you provide to us.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        6. Ownership; Proprietary Rights. The Service is owned and operated by
        AIDE-TOOLS. The visual interfaces, graphics, design, compilation,
        information, data, computer code (including source code or object code),
        products, software, services, and all other elements of the Service
        provided by AIDE-TOOLS (&ldquo;Materials&rdquo;) are protected by
        intellectual property and other laws. &ldquo;Materials&rdquo; does not
        include any User Content. All Materials included in the Service are the
        property of AIDE-TOOLS or its third-party licensors. Except as expressly
        authorized by AIDE-TOOLS, you may not make use of the Materials. There
        are no implied licenses in these Terms and AIDE-TOOLS reserves all
        rights to the Materials not granted expressly in these Terms.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>7. Third-Party Terms</p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        7.1 Third-Party Services and Linked Websites. AIDE-TOOLS may provide
        tools through the Service that enable you to export information,
        including User Content, to third-party services, including through
        features that allow you to link your Account on the Service with an
        account on the third-party service. The Service may also contain links
        to third-party websites. Linked websites are not under
        AIDE-TOOLS&rsquo;s control, and AIDE-TOOLS is not responsible for their
        content. Please be sure to review the terms of use and privacy policy of
        any third-party services before you share any User Content or
        information with such third-party services. Once sharing occurs,
        AIDE-TOOLS will have no control over the information that has been
        shared.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        7.2 Third-Party Software. The Service may include or incorporate
        third-party software components that are generally available free of
        charge under licenses granting recipients broad rights to copy, modify,
        and distribute those components (&ldquo;Third-Party Components&rdquo;).
        Although the Service is provided to you subject to these Terms, nothing
        in these Terms prevents, restricts, or is intended to prevent or
        restrict you from obtaining Third-Party Components under the applicable
        third-party licenses or to limit your use of Third-Party Components
        under those third-party licenses.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>8. Content</p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        8.1 Adding models for the Service is at the expense of Civitai API.
        Models and generated images that you add to the site are protected by
        copyright in accordance with the Terms of service of the source.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        8.2 User Content Disclaimer. We are under no obligation to User Content
        that you add on AIDE-TOOLS&nbsp; and will not be in any way responsible
        or liable for User Content.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        8.3 Content Moderation. AIDE-TOOLS does not control and does not have
        any obligation to monitor: (a) User Content; (b) any content made
        available by third parties; or (c) the use of the Service by its Users.
        You acknowledge and agree that AIDE-TOOLS reserves the right to, and may
        from time to time, monitor any and all information transmitted or
        received through the Service for operational and other purposes and
        moderate all User Content on the Services, at its discretion. If at any
        time AIDE-TOOLS chooses to monitor or moderate the content, then
        AIDE-TOOLS still assumes no responsibility or liability for content or
        any loss or damage incurred as a result of the use of content. During
        monitoring, information may be examined, recorded, copied, and used in
        accordance with our Privacy Policy (defined below).
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>9. Communications</p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        9.1 Email. We may send you technical email: for email address
        verification, password reset or email address change. The Service does
        not send advertising emails, so if you receive a suspicious email from
        AIDE-TOOLS, please notify us of the incident by email{" "}
        <LinkA href="mailto:support@aide-tools.com">
          support@aide-tools.com
        </LinkA>{" "}
        to avoid fraudulent activity with your account.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10. Prohibited Conduct. BY USING THE SERVICE, YOU AGREE NOT TO:
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.1 use the Service for any illegal purpose or in violation of any
        local, state, national, or international law;
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.2 violate, encourage others to violate, or provide instructions on
        how to violate, any right of a third party, including by infringing or
        misappropriating any third-party intellectual property right;
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.3 access, search, or otherwise use any portion of the Service through
        the use of any engine, software, tool, agent, device, or mechanism
        (including spiders, robots, crawlers, and data mining tools) other than
        the software or search agents provided by AIDE-TOOLS;
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.4 interfere with security-related features of the Service, including
        by: (i) disabling or circumventing features that prevent or limit use,
        printing or copying of any content; or (ii) reverse engineering or
        otherwise attempting to discover the source code of any portion of the
        Service except to the extent that the activity is expressly permitted by
        applicable law;
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.5 interfere with the operation of the Service or any User&rsquo;s
        enjoyment of the Service, including by: (i) uploading or otherwise
        disseminating any virus, adware, spyware, worm, or other malicious code;
        (ii) making any unsolicited offer or advertisement to another User;
        (iii) collecting personal information about another User or third party
        without consent; or (iv) interfering with or disrupting any network,
        equipment, or server connected to or used to provide the Service;
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.6 perform any fraudulent activity including impersonating any person
        or entity, claiming a false affiliation or identity, accessing any other
        Service account without permission;
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.7 sell or otherwise transfer the access granted under these Terms or
        any Materials (as defined in Section 6 (Ownership; Proprietary Rights))
        or any right or ability to view, access, or use any Materials; or
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        10.8 attempt to do any of the acts described in this Section 10
        (Prohibited Conduct) or assist or permit any person in engaging in any
        of the acts described in this Section 10 (Prohibited Conduct).
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        11. Modification of Terms. We may, from time to time, change these
        Terms. Please check these Terms periodically for changes. Revisions will
        be effective immediately after posting. We may require that you accept
        modified Terms in order to continue to use the Service. If you do not
        agree to the modified Terms, then you should remove your User Account
        and discontinue your use of the Service.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        12. Term, Termination, and Modification of the Service
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        12.1 Term. These Terms are effective beginning when you accept the Terms
        or first download, install, access, or use the Service, and ending when
        terminated as described in Section 12.2 (Termination).
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        12.2 Termination. If you violate any provision of these Terms, then your
        authorization to access the Service and these Terms automatically
        terminate. In addition, AIDE-TOOLS may, at its sole discretion,
        terminate these Terms or your Account on the Service, or suspend or
        terminate your access to the Service, at any time for any reason or no
        reason, with or without notice, and without any liability to you arising
        from such termination. You may terminate your Account and these Terms at
        any time by following the instructions in your Account or contacting us
        at{" "}
        <LinkA href="mailto:support@aide-tools.com">
          support@aide-tools.com
        </LinkA>
        .
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        12.3 Effect of Termination. Upon termination of these Terms: (a) your
        license rights will terminate and you must immediately cease all use of
        the Service; (b) you will no longer be authorized to access your Account
        or the Service; and (c) Sections 5.3 (Feedback), 6 (Ownership;
        Proprietary Rights), 12.3 (Effect of Termination), 13 (Indemnity), 14
        (Disclaimers; No Warranties by AIDE-TOOLS), 15 (Limitation of
        Liability), 16 (Dispute Resolution and Arbitration), and 17
        (Miscellaneous) will survive. You are solely responsible for retaining
        copies of any User Content you Save to the Service since upon
        termination of your Account, you may lose access rights to any User
        Content you Saved to the Service. If your Account has been terminated
        for a breach of these Terms, then you are prohibited from creating a new
        Account on the Service using a different name, email address or other
        forms of Account verification.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        12.4 Modification of the Service. AIDE-TOOLS reserves the right to
        modify or discontinue all or any portion of the Service at any time
        (including by limiting or discontinuing certain features of the
        Service), temporarily or permanently, without notice to you. AIDE-TOOLS
        will have no liability for any change to the Service or any suspension
        or termination of your access to or use of the Service. You should
        retain copies of any User Content you Save to the Service so that you
        have permanent copies in the event the Service is modified in such a way
        that you lose access to User Content you Saved to the Service.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        13. Indemnity. To the fullest extent permitted by law, you are
        responsible for your use of the Service, and you will defend and
        indemnify AIDE-TOOLS, its affiliates and their respective shareholders,
        directors, managers, members, officers, employees, consultants, and
        agents (together, the &ldquo;AIDE-TOOLS Entities&rdquo;) from and
        against every claim brought by a third party, and any related liability,
        damage, loss, and expense, including attorneys&rsquo; fees and costs,
        arising out of or connected with: (1) your unauthorized use of, or
        misuse of, the Service, including User Content of other Users; (2) your
        violation of any portion of these Terms, any representation, warranty,
        or agreement referenced in these Terms, or any applicable law or
        regulation; (3) your violation of any third-party right, including any
        intellectual property right or publicity, confidentiality, other
        property, or privacy right; or (4) any dispute or issue between you and
        any third party.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        14. Disclaimers; No Warranties by AIDE-TOOLS
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        14.1 THE SERVICE AND ALL MATERIALS AND CONTENT AVAILABLE THROUGH THE
        SERVICE ARE PROVIDED &ldquo;AS IS&rdquo; AND ON AN &ldquo;AS
        AVAILABLE&rdquo; BASIS. AIDE-TOOLS DISCLAIMS ALL WARRANTIES OF ANY KIND,
        WHETHER EXPRESS OR IMPLIED, RELATING TO THE SERVICE AND ALL MATERIALS
        AND CONTENT AVAILABLE THROUGH THE SERVICE, INCLUDING: (A) ANY IMPLIED
        WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
        QUIET ENJOYMENT, OR NON-INFRINGEMENT; AND (B) ANY WARRANTY ARISING OUT
        OF COURSE OF DEALING, USAGE, OR TRADE. AIDE-TOOLS DOES NOT WARRANT THAT
        THE SERVICE OR ANY PORTION OF THE SERVICE, OR ANY MATERIALS OR CONTENT
        OFFERED THROUGH THE SERVICE, WILL BE UNINTERRUPTED, SECURE, OR FREE OF
        ERRORS, VIRUSES, OR OTHER HARMFUL COMPONENTS, AND AIDE-TOOLS DOES NOT
        WARRANT THAT ANY OF THOSE ISSUES WILL BE CORRECTED.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        14.2 NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU
        FROM THE SERVICE OR AIDE-TOOLS ENTITIES OR ANY MATERIALS OR CONTENT
        AVAILABLE THROUGH THE SERVICE WILL CREATE ANY WARRANTY REGARDING ANY OF
        THE AIDE-TOOLS ENTITIES OR THE SERVICE THAT IS NOT EXPRESSLY STATED IN
        THESE TERMS. WE ARE NOT RESPONSIBLE FOR ANY DAMAGE THAT MAY RESULT FROM
        THE SERVICE AND YOUR DEALING WITH ANY OTHER SERVICE USER. YOU UNDERSTAND
        AND AGREE THAT YOU USE ANY PORTION OF THE SERVICE AT YOUR OWN DISCRETION
        AND RISK, AND THAT WE ARE NOT RESPONSIBLE FOR ANY DAMAGE TO YOUR
        PROPERTY (INCLUDING YOUR COMPUTER SYSTEM OR MOBILE DEVICE USED IN
        CONNECTION WITH THE SERVICE) OR ANY LOSS OF DATA, INCLUDING USER
        CONTENT.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        14.3 THE LIMITATIONS, EXCLUSIONS AND DISCLAIMERS IN THIS SECTION 14
        (DISCLAIMERS; NO WARRANTIES BY AIDE-TOOLS) APPLY TO THE FULLEST EXTENT
        PERMITTED BY LAW. AIDE-TOOLS does not disclaim any warranty or other
        right that AIDE-TOOLS is prohibited from disclaiming under applicable
        law.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>15. Limitation of Liability</p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        15.1 TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE
        AIDE-TOOLS ENTITIES BE LIABLE TO YOU FOR ANY INDIRECT, INCIDENTAL,
        SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES (INCLUDING DAMAGES FOR LOSS
        OF PROFITS, GOODWILL, OR ANY OTHER INTANGIBLE LOSS) ARISING OUT OF OR
        RELATING TO YOUR ACCESS TO OR USE OF, OR YOUR INABILITY TO ACCESS OR
        USE, THE SERVICE OR ANY MATERIALS OR CONTENT ON THE SERVICE, WHETHER
        BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR
        ANY OTHER LEGAL THEORY, AND WHETHER OR NOT ANY AIDE-TOOLS ENTITY HAS
        BEEN INFORMED OF THE POSSIBILITY OF DAMAGE.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        15.2 EACH PROVISION OF THESE TERMS THAT PROVIDES FOR A LIMITATION OF
        LIABILITY, DISCLAIMER OF WARRANTIES, OR EXCLUSION OF DAMAGES IS INTENDED
        TO AND DOES ALLOCATE THE RISKS BETWEEN THE PARTIES UNDER THESE TERMS.
        THIS ALLOCATION IS AN ESSENTIAL ELEMENT OF THE BASIS OF THE BARGAIN
        BETWEEN THE PARTIES. EACH OF THESE PROVISIONS IS SEVERABLE AND
        INDEPENDENT OF ALL OTHER PROVISIONS OF THESE TERMS. THE LIMITATIONS IN
        THIS SECTION 15 (LIMITATION OF LIABILITY) WILL APPLY EVEN IF ANY LIMITED
        REMEDY FAILS OF ITS ESSENTIAL PURPOSE.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        16. Dispute Resolution and Arbitration
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        16.1 Generally. Except as described in Section 16.2 (Exceptions) and
        16.3 (Opt-Out), you and AIDE-TOOLS agree that every dispute arising in
        connection with these Terms, the Service, or communications from us will
        be resolved through binding arbitration. Arbitration uses a neutral
        arbitrator instead of a judge or jury, is less formal than a court
        proceeding, may allow for more limited discovery than in court, and is
        subject to very limited review by courts. This agreement to arbitrate
        disputes includes all claims whether based in contract, tort, statute,
        fraud, misrepresentation, or any other legal theory, and regardless of
        whether a claim arises during or after the termination of these Terms.
        Any dispute relating to the interpretation, applicability, or
        enforceability of this binding arbitration agreement will be resolved by
        the arbitrator. YOU UNDERSTAND AND AGREE THAT, BY ENTERING INTO THESE
        TERMS, YOU AND AIDE-TOOLS ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY
        OR TO PARTICIPATE IN A CLASS ACTION.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        16.2 Exceptions. Although we are agreeing to arbitrate most disputes
        between us, nothing in these Terms will be deemed to waive, preclude, or
        otherwise limit the right of either party to: (a) seek injunctive relief
        in a court of law in aid of arbitration.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        16.3 Arbitrator. This arbitration agreement, and any arbitration between
        us, is subject the Federal Arbitration Act and will be administered by
        the Ukrainian Arbitration Association (&ldquo;UAA&rdquo;) under its
        Consumer Arbitration Rules (collectively, &ldquo;UAA Rules&rdquo;) as
        modified by these Terms. The UAA Rules and filing forms are available
        online at arbitration.kiev.ua, or by contacting AIDE-TOOLS.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        16.4 Commencing Arbitration. Before initiating arbitration, a party must
        first send a written notice of the dispute to the other party by
        electronic mail (&ldquo;Notice of Arbitration&rdquo;).
        AIDE-TOOLS&rsquo;s email for Notice is:{" "}
        <LinkA href="mailto:support@aide-tools.com">
          support@aide-tools.com
        </LinkA>
        . The Notice of Arbitration must: (a) identify the name or Account
        number of the party making the claim; (b) describe the nature and basis
        of the claim or dispute; and (c) set forth the specific relief sought
        (&ldquo;Demand&rdquo;). The parties will make good faith efforts to
        resolve the claim directly, but if the parties do not reach an agreement
        to do so within 30 days after the Notice of Arbitration is received, you
        or AIDE-TOOLS may commence an arbitration proceeding. If you commence
        arbitration in accordance with these Terms, AIDE-TOOLS will not
        reimburse you for your payment of the filing fee, unless any fees will
        be decided by the UAA Rules. If the arbitrator finds that either the
        substance of the claim or the relief sought in the Demand is frivolous
        or brought for an improper purpose (as measured by the standards set
        forth in Federal Rule of Civil Procedure 11(b)), then the payment of all
        fees will be governed by the UAA Rules and the other party may seek
        reimbursement for any fees paid to UAA.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>17. Miscellaneous</p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.1 General Terms. These Terms, including the Privacy Policy and any
        other agreements expressly incorporated by reference into these Terms,
        are the entire and exclusive understanding and agreement between you and
        AIDE-TOOLS regarding your use of the Service. You may not assign or
        transfer these Terms or your rights under these Terms, in whole or in
        part, by operation of law or otherwise, without our prior written
        consent. We may assign these Terms and all rights granted under these
        Terms, including with respect to your User Content, at any time without
        notice or consent. The failure to require performance of any provision
        will not affect our right to require performance at any other time after
        that, nor will a waiver by us of any breach or default of these Terms,
        or any provision of these Terms, be a waiver of any subsequent breach or
        default or a waiver of the provision itself. Use of Section headers in
        these Terms is for convenience only and will not have any impact on the
        interpretation of any provision. Throughout these Terms the use of the
        word &ldquo;including&rdquo; means &ldquo;including but not limited
        to.&rdquo; If any part of these Terms is held to be invalid or
        unenforceable, then the unenforceable part will be given effect to the
        greatest extent possible, and the remaining parts will remain in full
        force and effect.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.2 Governing Law. These Terms are governed by the laws of Ukraine
        without regard to conflict of law principles. You and AIDE-TOOLS submit
        to the personal and exclusive jurisdiction of the state courts and
        federal courts located within Kyiv, Ukraine for resolution of any
        lawsuit or court proceeding permitted under these Terms. We operate the
        Service from our offices in Ukraine, and we make no representation that
        Materials included in the Service are appropriate or available for use
        in other locations.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.3 Privacy Policy. Please read the AIDE-TOOLS{" "}
        <NavLink className={classes["tos__link"]} to="/privacy">
          Privacy Policy
        </NavLink>{" "}
        (the &ldquo;Privacy Policy&rdquo;) carefully for information relating to
        our collection, use, storage, and disclosure of your personal
        information. The AIDE-TOOLS Privacy Policy is incorporated by this
        reference into, and made a part of, these Terms.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.4 Additional Terms. Your use of the Service is subject to all
        additional terms, policies, rules, or guidelines applicable to the
        Service or certain features of the Service that we may post on or link
        to from the Service (the &ldquo;Additional Terms&rdquo;). All Additional
        Terms are incorporated by this reference into, and made a part of, these
        Terms.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.5 Consent to Electronic Communications. By using the Service, you
        consent to receiving certain electronic communications from us as
        further described in our Privacy Policy. Please read our Privacy Policy
        to learn more about our electronic communications practices. You agree
        that any notices, agreements, disclosures, or other communications that
        we send to you electronically will satisfy any legal communication
        requirements, including that those communications be in writing.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.6 No Support. We are under no obligation to provide support for the
        Service. In instances where we may offer support, the support will be
        subject to published policies.
      </p>
      <p className={classes["tos__text"]} className={classes["tos__text"]}>
        17.7 International Use. The Service is intended for visitors located
        within Ukraine. We make no representation that the Service is
        appropriate or available for use outside of Ukraine. Access to the
        Service from countries or territories or by individuals where such
        access is illegal is prohibited.
      </p> */}
    </Card>
  );
};

export default ToS;

import { useState } from 'react';
import RiderSupportform from '@/Widgets/RiderSupport/RiderSupportForm';
import { useRouter } from 'next/router';
import ShipmentSupport from '@/pages/shipmenttab';
import RateCardTab from '@/pages/RateCradTab';
import WorkDetailsTab from '@/pages/WorkDetailsTab';
import Cashinhand from '@/pages/cashinhand/cashinhand';

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { id } = router.query;
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div>
      <ul>
        <li
          className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleTabClick('profile')}
        >
          Profile
        </li>
        <li
          className={`tab-item ${activeTab === 'shipments' ? 'active' : ''}`}
          onClick={() => handleTabClick('shipments')}
        >
          Shipments
        </li>
        <li
          className={`tab-item ${activeTab === 'fraud' ? 'active' : ''}`}
          onClick={() => handleTabClick('fraud')}
        >
          Fraud
        </li>
        <li
          className={`tab-item ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => handleTabClick('tickets')}
        >
          Tickets
        </li>
        <li
          className={`tab-item ${activeTab === 'payout' ? 'active' : ''}`}
          onClick={() => handleTabClick('payout')}
        >
          Payout
        </li>
        <li
          className={`tab-item ${activeTab === 'cash' ? 'active' : ''}`}
          onClick={() => handleTabClick('cash')}
        >
          Cash in Hand
        </li>
        <li
          className={`tab-item ${activeTab === 'ratecard' ? 'active' : ''}`}
          onClick={() => handleTabClick('ratecard')}
        >
          Rate Card
        </li>
        <li
          className={`tab-item ${activeTab === 'workdetails' ? 'active' : ''}`}
          onClick={() => handleTabClick('workdetails')}
        >
          Work Details
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'profile' && <RiderSupportform res={id} />}
        {activeTab === 'shipments' && <ShipmentSupport res={id} />}
        {activeTab === 'fraud' && <div>Fraud content</div>}
        {activeTab === 'tickets' && <div>Tickets content</div>}
        {activeTab === 'payout' && <div>Payout</div>}
        {activeTab === 'cash' && <div><Cashinhand res={id}/></div>}
        {activeTab === 'workdetails' && <WorkDetailsTab res={id} />}
        {activeTab === 'ratecard' && (
          <div>
            <h3>Rate Log</h3>
            <RateCardTab res={id} handleClose={handleClose} open={open} />
          </div>
        )}
           {activeTab === 'reservations' && <div>Reservations</div>}
      </div>


      <style jsx>{`
  ul {
    list-style: none;
    display: flex;
    gap: 10px; 
  }

  .tab-item {
    padding: 10px 20px;
    margin-right: 5px;
    border: 1px solid #58D36E;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    border-radius: 15px;
    font: normal 18px/27px Poppins; 
    letter-spacing: 0px;
  }

  .tab-item.active {
    background-color: #58D36E;
    color: #fff;
  }

  .tab-content {
    margin-top: 20px;
  }
`}</style>

    </div>
  );
};

export default Tabs;

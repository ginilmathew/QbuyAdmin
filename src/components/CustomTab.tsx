import { useState } from 'react';
import RiderSupportform from '@/Widgets/RiderSupport/RiderSupportForm';
import { useRouter } from 'next/router';
import ShipmentSupport from '@/pages/shipmenttab';
import RateCardTab from '@/pages/RateCradTab';
const Tabs = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const { id } = router.query;
  // Define open and handleClose functions
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
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => handleTabClick('profile')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Profile
        </li>
        <li
          className={activeTab === 'shipments' ? 'active' : ''}
          onClick={() => handleTabClick('shipments')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Shipments
        </li>
        <li
          className={activeTab === 'fraud' ? 'active' : ''}
          onClick={() => handleTabClick('fraud')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Fraud
        </li>
        <li
          className={activeTab === 'tickets' ? 'active' : ''}
          onClick={() => handleTabClick('tickets')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Tickets
        </li>
        <li
          className={activeTab === 'ratecard' ? 'active' : ''}
          onClick={() => handleTabClick('ratecard')}
          style={{
            cursor: 'pointer',
            padding: '10px 20px',
            backgroundColor: '#f0f0f0',
            marginRight: '5px',
            border: '1px solid #ccc',
          }}
        >
          Rate Card
        </li>
      </ul>

      <div className="tab-content">
        {activeTab === 'profile' && <RiderSupportform res={id} />}
        {activeTab === 'shipments' && <ShipmentSupport res={id} />}
        {activeTab === 'fraud' && <div>Fraud content</div>}
        {activeTab === 'tickets' && <div>Tickets content</div>}
        {activeTab === 'ratecard' && (
          <div>
            <h3 style={{ marginLeft: '40px' }}>Rate Log</h3>
            <RateCardTab res={id} handleClose={handleClose} open={open} />
          </div>
        )}



      </div>

      <style jsx>{`
        ul {
          list-style: none;
          display: flex;
        }

        li.active {
          background-color: #0070f3;
          color: white;
        }

        .tab-content {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Tabs;

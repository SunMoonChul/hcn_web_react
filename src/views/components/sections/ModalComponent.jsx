import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Chart from 'react-apexcharts';
import './ModalComponent.css';

Modal.setAppElement('#root');

const ModalComponent = ({ isOpen, onRequestClose, currentItem }) => {
  const [activeMetric, setActiveMetric] = useState('followers');
  const [chartData, setChartData] = useState({ dates: [], data: [] });
  const [latestData, setLatestData] = useState({});
  const [genderData, setGenderData] = useState({ series: [], labels: [] });
  const [ageData, setAgeData] = useState({ series: [], labels: [] });

  useEffect(() => {
    if (currentItem && currentItem.accountSummaries) {
      const userSummaries = currentItem.accountSummaries;
      const updatedSummaries = userSummaries.map(item => ({
        ...item,
        commentCount: item.commentCount + item.replyCount
      }));
      updateChartData(updatedSummaries, activeMetric);
      updateLatestData(updatedSummaries);
    }
    if (currentItem && currentItem.genderRatios) {
      const genderRatios = currentItem.genderRatios;
      const latestGenderData = genderRatios[genderRatios.length - 1];
      setGenderData({
        series: [latestGenderData.male, latestGenderData.female],
        labels: ['Male', 'Female']
      });
    }
    if (currentItem && currentItem.followersAgeRanges) {
      const ageRanges = currentItem.followersAgeRanges;
      const latestAgeData = ageRanges[ageRanges.length - 1];
      setAgeData({
        series: [
          latestAgeData.age13_17,
          latestAgeData.age18_24,
          latestAgeData.age25_34,
          latestAgeData.age35_44,
          latestAgeData.age45_54,
          latestAgeData.age55_64,
          latestAgeData.age65_plus
        ],
        labels: [
          '13-17',
          '18-24',
          '25-34',
          '35-44',
          '45-54',
          '55-64',
          '65+'
        ]
      });
    }
  }, [currentItem, activeMetric]);

  const updateChartData = (summaries, metric) => {
    const sortedSummaries = [...summaries].sort((a, b) => new Date(a.analysisDate) - new Date(b.analysisDate));
    const dates = sortedSummaries.map(item => item.analysisDate);
    const data = sortedSummaries.map(item => item[metric]);
    setChartData({ dates, data });
  };

  const updateLatestData = (summaries) => {
    const latestSummary = [...summaries].sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate))[0];
    setLatestData({
      followers: latestSummary.followers,
      profileViews: latestSummary.profileViews,
      allLikes: latestSummary.allLikes,
      commentCount: latestSummary.commentCount // 합산된 댓글 수를 사용합니다.
    });
  };

  const handleButtonClick = (metric) => {
    setActiveMetric(metric);
    updateChartData(currentItem.accountSummaries, metric);
  };

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    title: {
      text: `${activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)} Growth`,
      align: 'center'
    },
    xaxis: {
      categories: chartData.dates
    },
    yaxis: {
      title: {
        text: activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1)
      }
    },
    stroke: {
      curve: 'smooth'
    },
    colors: ['#6b00e2'],
    annotations: {
      position: 'back'
    }
  };

  const chartSeries = [
    {
      name: activeMetric.charAt(0).toUpperCase() + activeMetric.slice(1),
      data: chartData.data
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Profile Modal"
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="modal-header">
        <div className="profile-info">
          <img
            src={currentItem ? currentItem.profileImage : 'default-profile-image-url'}
            alt={currentItem ? currentItem.username : 'Profile'}
            className="profile-image"
          />
          <div className="profile-name">{currentItem ? currentItem.username : 'Unknown User'}</div>
        </div>
        <button onClick={onRequestClose} className="close-button">Close</button>
      </div>
      
      <div className="modal-content">
        <div className="section">
          <div className="section-title">Summary</div>
          <div className="stats">
            <div className={`stat-item ${activeMetric === 'followers' ? 'active' : ''}`} onClick={() => handleButtonClick('followers')}>
              <div className="stat-title">
                <span role="img" aria-label="followers">👥</span> Followers
              </div>
              <div className="stat-value">{latestData.followers ? latestData.followers.toLocaleString() : '0'}</div>
            </div>
            <div className={`stat-item ${activeMetric === 'profileViews' ? 'active' : ''}`} onClick={() => handleButtonClick('profileViews')}>
              <div className="stat-title">
                <span role="img" aria-label="profileViews">📈</span> Profile Views
              </div>
              <div className="stat-value">{latestData.profileViews ? latestData.profileViews.toLocaleString() : '0'}</div>
            </div>
            <div className={`stat-item ${activeMetric === 'allLikes' ? 'active' : ''}`} onClick={() => handleButtonClick('allLikes')}>
              <div className="stat-title">
                <span role="img" aria-label="allLikes">❤️</span> Likes
              </div>
              <div className="stat-value">{latestData.allLikes ? latestData.allLikes.toLocaleString() : '0'}</div>
            </div>
            <div className={`stat-item ${activeMetric === 'commentCount' ? 'active' : ''}`} onClick={() => handleButtonClick('commentCount')}>
              <div className="stat-title">
                <span role="img" aria-label="commentCount">💬</span> Comments
              </div>
              <div className="stat-value">{latestData.commentCount ? latestData.commentCount.toLocaleString() : '0'}</div>
            </div>
          </div>
          <div className="chart-container">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={350}
            />
          </div>
        </div>

        <div className="section">
          <div className="section-title">Follower Analysis</div>
          <div className="follower-analysis">
            <div className="analysis-item">
              <div className="analysis-title">Gender</div>
              <div className="chart-container">
                <Chart
                  options={{
                    labels: genderData.labels,
                    colors: ['#1E90FF', '#FF1493']
                  }}
                  series={genderData.series}
                  type="pie"
                  height={250}
                />
              </div>
            </div>
            <div className="analysis-item">
              <div className="analysis-title">Age</div>
              <div className="chart-container">
                <Chart
                  options={{
                    chart: {
                      type: 'bar'
                    },
                    xaxis: {
                      categories: ageData.labels
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val) => `${val}%`,
                      style: {
                        colors: ['#000000']
                      }
                    },
                    plotOptions: {
                      bar: {
                        dataLabels: {
                          position: 'top' // 옵션은 'top', 'center', 'bottom' 중 하나를 선택할 수 있습니다.
                        }
                      }
                    },
                    colors: ['#6b00e2']
                  }}
                  series={[{ data: ageData.series.map(value => value.toFixed(1)) }]}
                  type="bar"
                  height={250}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">Public Sentiment</div>
          <div className="content-performance">
            <div className="performance-item">
              <div className="performance-metric">
                <span role="img" aria-label="like">😊</span> Like Rate
              </div>
              <div className="performance-value">34.15%</div>
            </div>
            <div className="performance-item">
              <div className="performance-metric">
                <span role="img" aria-label="comment">😐</span> Comment Rate
              </div>
              <div className="performance-value">0.66%</div>
            </div>
            <div className="performance-item">
              <div className="performance-metric">
                <span role="img" aria-label="engagement">😟</span> Engagement Rate
              </div>
              <div className="performance-value">34.81%</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalComponent;

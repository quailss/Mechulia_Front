import React, { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { fetchBannerRecipes } from "../store/slices/bannerSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "../styles/banner.css"; 

// 5개의 랜덤 레시피를 선택하는 함수
function getRandomRecipes(recipes: any[]) {
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

const Banner = () => {
    const dispatch: AppDispatch = useDispatch();
    const { bannerRecipes, status, error } = useSelector((state: RootState) => state.banner);
    const [randomRecipes, setRandomRecipes] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const navigate = useNavigate();
  
    // 컴포넌트가 처음 렌더링될 때 레시피 가져오기
    useEffect(() => {
      dispatch(fetchBannerRecipes());
    }, [dispatch]);

    //가져온 레시피 중 5개 랜덤 선택
    useEffect(() => {
        if (bannerRecipes.length > 0) {
          const randomSelection = getRandomRecipes(bannerRecipes);
          setRandomRecipes(randomSelection);
        }
      }, [bannerRecipes]);

    // 첫 번째 이미지를 미리 로드
    useEffect(() => {
      if (randomRecipes.length > 0) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = randomRecipes[0].image_url.replace(/\.(jpg|jpeg|png)$/, ".webp"); // WebP 형식 사용 시
        document.head.appendChild(link);
      }
    }, [randomRecipes]);
  
    // 5초마다 이미지 변경
    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomRecipes.length); // randomRecipes로 변경
        }, 5000);
        return () => clearInterval(interval);
    }, [randomRecipes]); 
  
    if (status === 'loading') {
      return <div>Loading...</div>;
    }
  
    if (status === 'failed') {
      return <div>Error: {error}</div>;
    }

    const currentRecipe = bannerRecipes[currentIndex];
  
    return (
      <>
      {/* Helmet을 사용해 preload 설정 */}
      {randomRecipes.length > 0 && (
        <Helmet>
          <link
            rel="preload"
            as="image"
            href={randomRecipes[0].image_url.replace(/\.(jpg|jpeg|png)$/, ".webp")}
          />
        </Helmet>
      )}

      <div className="banner-container">
        {bannerRecipes.length > 0 && (
          <div className="banner-item">
              <picture>
                {/* WebP 이미지 형식 제공 */}
                <source
                  srcSet={bannerRecipes[currentIndex].image_url.replace(/\.(jpg|jpeg|png)$/, ".webp")}
                  type="image/webp"
                />
                {/* 기본 이미지 형식 제공 */}
                <img
                  src={bannerRecipes[currentIndex].image_url}
                  alt={bannerRecipes[currentIndex].name}
                  className="banner-image"
                />
              </picture>
            <div className="inner-item">
                <h3 className="banner-name">{bannerRecipes[currentIndex].name}</h3>
                <div className="banner-counter">
                    <span className="banner-counter-container">
                        <span className="banner-counter-number">{currentIndex + 1}</span> / {randomRecipes.length}
                    </span>
                    <button
                      className="banner-recipe"
                      onClick={() => {
                        navigate(`/recipe?${currentRecipe.name}`, {
                          state: { name: currentRecipe.name, id: currentRecipe.id, image_url: encodeURIComponent(currentRecipe.image_url) }
                        });
                      }}
                    >
                      레시피 보러가기
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  };
export default Banner;

